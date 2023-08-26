import { JsonRpcProvider } from "@msmania/pocketjs-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { Relayer as PocketJsRelayer } from "@msmania/pocketjs-relayer";
import { SortObjectKeys } from "./utils";
import { LoadDB } from "./mongo";

let initialized = false;
const PocketClients = {};

async function InitPocket(forceInit) {
  if (initialized) {
    return;
  }

  const db = await LoadDB(forceInit);

  for (const [network, p] of Object.entries(db.params)) {
    const POCKET_ENDPOINT = p.POCKET_ENDPOINT;
    const APP_PRIVATE_KEY = p.APP_PRIVATE_KEY;

    const Provider = new JsonRpcProvider({
      rpcUrl: POCKET_ENDPOINT,
      dispatchers: [POCKET_ENDPOINT],
    });
    const AppSigner =
      await KeyManager.fromPrivateKey(APP_PRIVATE_KEY);
    const ClientSigner = await KeyManager.createRandom();
    const AAT = await PocketJsRelayer.GenerateAAT(
      AppSigner,
      ClientSigner.publicKey,
    );
    const Relayer = new PocketJsRelayer({
      keyManager: ClientSigner,
      provider: Provider,
      dispatchers: Provider.dispatchers,
    });

    PocketClients[network] = {Provider, AppSigner, AAT, Relayer};
  }

  initialized = true;
}

async function LoadPocket(network) {
  await InitPocket();
  if (!(network in PocketClients)) {
    throw new Error(`Invalid network ID: '${network ?? ''}'`);
  }
  return PocketClients[network];
}

export async function QueryApp(network) {
  const {Provider, AppSigner} = await LoadPocket(network);
  const appAddr = AppSigner.getAddress();
  const app = await Provider.getApp({address: appAddr});
  return app;
}

export async function QueryHeight(network) {
  const {Provider} = await LoadPocket(network);
  const height = await Provider.getBlockNumber();
  return height;
}

export async function DispatchRequest(network, height, chain) {
  const {Provider, AppSigner} = await LoadPocket(network);
  const resp = await Provider.dispatch({
      sessionHeader: {
        sessionBlockHeight: parseInt(height),
        chain,
        applicationPubKey: AppSigner.publicKey,
      },
    })
  return resp;
}

function processPromiseResult(result, onFulFill, onRejected) {
  return result.status == 'fulfilled'
    ? onFulFill(result.value)
    : result.status == 'rejected'
    ? (onRejected ? onRejected(result.reason) : {reason: result.reason})
    : result;
}

function extractAsHttpRpcPayload(payloadStr) {
  try {
    const payload = JSON.parse(payloadStr);
    if ('jsonrpc' in payload) {
      return null;
    }

    if (payload?.data) {
      payload.data = payload.data;
    }
    if (payload?.method) {
      payload.method = payload.method;
    }
    if (payload?.path) {
      payload.path = payload.path;
    }
    if (payload?.headers) {
      payload.headers = payload.headers;
    }
    return payload;
  }
  catch (e) {}
  return null;
}

export async function Relay(network, session, relayPlan, payloadStr) {
  const {Relayer, AppSigner, AAT} = await LoadPocket(network);

  const maybeHttpRpcPayload = extractAsHttpRpcPayload(payloadStr);
  const payloadData = JSON.stringify(maybeHttpRpcPayload?.data) ?? payloadStr;
  const defaultPath = session.header.chain == '03DF'
    ? '/ext/bc/q2aTwKuyzgs8pynF7UXBZCU7DejbZbZ6EUyHr3JQzYgwNPUPi/rpc'
    : session.header.chain == '0003' || session.header.chain == '00A3'
    ? '/ext/bc/C/rpc'
    : '';
  session.header.applicationPubKey = AppSigner.publicKey;
  const tasksAll = relayPlan.map(
    (plan) => {
      const nodeIndex = plan[0];
      const relayCount = plan[1];
      const tasksPerNode = Array.from(Array(relayCount).keys())
        .map(() => Relayer.relay({
            data: payloadData,
            blockchain: session.header.chain,
            pocketAAT: AAT,
            session,
            node: session.nodes[nodeIndex],
            method: maybeHttpRpcPayload?.method ?? 'POST',
            path: maybeHttpRpcPayload?.path ?? defaultPath,
            headers: maybeHttpRpcPayload?.headers ?? null,
            options: {
              retryAttempts: 0,
              rejectSelfSignedCertificates: false,
              timeout: 8000,
            },
          }));
      return Promise.allSettled(tasksPerNode);
    }
  );
  const results = await Promise.allSettled(tasksAll);

  const resultsNorm = results.map(
    result => processPromiseResult(result,
      value => value.map(
        resInner => processPromiseResult(resInner,
          valInner => {
            try {
              const parsed = JSON.parse(valInner.response);
              const sorted = SortObjectKeys(parsed);
              const sortedStr = JSON.stringify(sorted);
              return {
                response: sorted,
                isSorted: sortedStr == valInner.response,
                elapsedInNSec: valInner.elapsedInNSec.toString(),
              };
            }
            catch (e) {
              return {
                response: valInner.response,
                isSorted: false,
                elapsedInNSec: valInner.elapsedInNSec.toString(),
              };
            }
          },
          errReason => ({reason: SortObjectKeys(errReason)}),
        )
      )
    )
  );
  return resultsNorm;
}
