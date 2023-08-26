'use client';
import { useState } from "react";
import { UrlForDisplay } from "../utils";
import SpinnerButton from "./button";
import RelayPayload from "./relayPayload";
import PocketError from "./pocketError";

export default function RelayPlan({
  session,
  relayCounts,
  dispatchInfo,
  setRelayCounts,
  execRelayPlan,
}) {
  if (!session) {
    return <p></p>
  }

  const [pending, SetPending] = useState(false);
  const [payload, setPayload] = useState('');
  const [relayErr, setRelayErr] = useState();

  const handleInputChange = (event) => {
    const target = event.target;
    const indexChanged = target.parentNode.parentNode.getAttribute("value");
    const newArray = relayCounts.map(
      (value, idx) => idx == indexChanged ? parseInt(target.value) : value);
    setRelayCounts(newArray);
  };

  const handleRun = async (event) => {
    SetPending(true);
    const plan = relayCounts
      .map((count, idx) => [idx, count])
      .filter(pair => pair[1] > 0);
    try {
      await execRelayPlan(plan, payload);
      setRelayErr('');
    }
    catch (e) {
      setRelayErr(e);
    }
    finally {
      SetPending(false);
    }
  };

  const isC0D3R = (idx) => {
    const node = session.nodes[idx];
    const url = new URL(node.serviceUrl);
    return url.host.endsWith('.c0d3r.org');
  }

  const handleSelect = (event) => {
    const rnd = Math.floor(Math.random() * session.nodes.length);
    const mapper = {
      'button-c0d3r': (el, idx) => isC0D3R(idx) ? el + 1 : el,
      'button-random': (el, idx) => idx == rnd ? el + 1 : el,
      'button-all': el => el + 1,
      'button-reset': () => 0,
    };
    setRelayCounts(relayCounts.map(mapper[event.target.id]));
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4
      text-gray-700 w-full flex flex-col">
      <h3 className="text-sm font-bold mb-2">
        <span title="Session Block Height">SBH</span>:
        {session.header.sessionBlockHeight}
        &nbsp;
        Chain:
        {session.header.chain}
      </h3>
      <table className="table-auto shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm">
        <thead>
          <tr>
            <th className="p-4">#</th>
            <th className="text-left">Url</th>
            <th className=""></th>
            <th className="p-4 text-end w-6">Count</th>
          </tr>
        </thead>
        <tbody>
          {session.nodes.map((node, idx) =>
            <tr key={idx} value={idx}>
              <td className="text-center">{idx + 1}</td>
              <td title={node.serviceUrl}>{UrlForDisplay(node.serviceUrl)}</td>
              <td>
                <a target="_blank"
                  href={'https://v2.poktscan.com/node/' + node.address}>
                  <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12V6C5 5.44772 5.44772 5 6 5H18C18.5523 5 19 5.44772 19 6V18C19 18.5523 18.5523 19 18 19H12M8.11111 12H12M12 12V15.8889M12 12L5 19" stroke="#464455" strokeLinecap="round" strokeLinejoin="round"/>
                    <title>{node.address}</title>
                  </svg>
                </a>
              </td>
              <td>
                <input type="number"
                  className="text-end w-full pe-4"
                  value={relayCounts[idx]}
                  min={0}
                  onChange={handleInputChange}/>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex flex-row justify-center">
        <div className="mt-2 border p-1 shadow rounded mx-2">
          +1 to
          <button id="button-random" onClick={handleSelect} type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mx-1
              rounded focus:outline-none focus:shadow-outline">
            Random
          </button>
          <button id="button-c0d3r" onClick={handleSelect} type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mx-1
              rounded focus:outline-none focus:shadow-outline">
            C0D3R
          </button>
          <button id="button-all" onClick={handleSelect} type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mx-1
              rounded focus:outline-none focus:shadow-outline">
            All
          </button>
        </div>
        <div className="mt-2 border p-1 shadow rounded mx-2">
          <button id="button-reset" onClick={handleSelect} type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mx-1
              rounded focus:outline-none focus:shadow-outline">
            Reset
          </button>
        </div>
      </div>

      <h3 className="text-sm font-bold my-2">Payload</h3>
      <div className="mb-4">
        <RelayPayload
          chainId={session?.header?.chain}
          dispatchInfo={dispatchInfo}
          payload={payload}
          setPayload={setPayload}
        />
      </div>

      <div className="flex flex-row justify-center">
        <SpinnerButton onClick={handleRun} type="button"
          className="inline-flex bg-blue-500 hover:bg-blue-700 text-white font-bold
            py-2 mt-4 px-6 rounded focus:outline-none focus:shadow-outline
            transition ease-in-out duration-150"
          label="Run"
          labelPending="Running..."
          isPending={pending}
        />
      </div>
      <PocketError err={relayErr} />
    </div>
  );
}
