'use client';
import { useState } from "react";
import { GetJsonFetcher, SortBy } from "./utils";
import DispatchRequest from "./components/dispatchRequest";
import RelayPlan from "./components/relayPlan";
import RelayResults from './components/relayResults';
import SelectNetwork from './components/network';

function topDomain(urlStr) {
  const url = new URL(urlStr);
  return url.hostname.split('.').slice(-2).join('.')
}

const JsonFetcher = GetJsonFetcher('no-cache');

export default function Home() {
  const [network, setNetwork] = useState();
  const [dispatchInfo, setDispatchInfo] = useState(); 
  const [session, setSession] = useState();
  const [results, setResults] = useState();
  const [relayCounts, setRelayCounts] = useState();

  const onDispatchRequest = async (height, chainId) => {
    const newSession = await JsonFetcher(
      '/api/dispatch',
      {network, height, chainId},
    );

    if (!('nodes' in newSession)) {
      const err = new Error('Dispatch failure');
      err.info = newSession;
      throw err;
    }

    SortBy(newSession.nodes,  node => topDomain(node.serviceUrl));
    setSession(newSession);
    setRelayCounts(new Array(newSession.nodes.length).fill(0));
  };

  const execRelayPlan = async (plan, payload) => {
    if (plan.length == 0) {
      const err = new Error('Relay failure');
      err.info = 'Relay plan is empty.';
      throw err;
    }
    const newResults = await JsonFetcher('/api/relay', {
      network,
      session,
      relayPlan: plan,
      payload,
    });
    if (!Array.isArray(newResults)) {
      const err = new Error('Relay failure');
      err.info = newResults;
      throw err;
    }
    setResults(newResults.map((res, idx) => ({
      node: session.nodes[plan[idx][0]],
      results: res,
    })));
  };

  return (
    <main className="flex flex-col items-center
      p-24">
      <h1 className="mb-6 text-5xl font-bold">
        The Real Portal
      </h1>
      <p>No cherry-picking. No fee. Total transparency is here.</p>

      <h2 className="mt-6 text-3xl font-bold">
        Network
      </h2>
      <SelectNetwork
        setNetwork={setNetwork}
        setDispatchInfo={setDispatchInfo}
      />

      <h2 className="mt-6 text-3xl font-bold">
        Request Info
      </h2>
      <DispatchRequest
        network={network}
        dispatchInfo={dispatchInfo}
        onDispatchRequest={onDispatchRequest}
      />

      <h2 className="mt-6 text-3xl font-bold">
        Relay Plan
      </h2>
      <RelayPlan
        session={session}
        relayCounts={relayCounts}
        dispatchInfo={dispatchInfo}
        setRelayCounts={setRelayCounts}
        execRelayPlan={execRelayPlan}
      />

      <h2 className="mt-6 text-3xl font-bold">
        Relay Result
      </h2>
      <RelayResults results={results}/>
    </main>
  )
}
