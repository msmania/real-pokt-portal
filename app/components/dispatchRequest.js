'use client';
import { useState } from "react";
import SpinnerButton from './button';
import PocketError from './pocketError';
import { SortBy } from "../utils";

export default function DispatchRequest({
  dispatchInfo,
  onDispatchRequest,
}) {
  if (!dispatchInfo) {
    return <div></div>;
  }

  const chainsSorted = Array(dispatchInfo.chains).fill({});
  let idx = 0;
  for (const [chainId, chainInfo] of Object.entries(dispatchInfo.chains)) {
    const desc = chainInfo ? `${chainId} - ${chainInfo[0]}` : chainId;
    chainsSorted[idx++] = [chainId, desc];
  }
  SortBy(chainsSorted, x => x[0]);

  const [height, setHeight] = useState(0);
  const [selectedChainId, setSelectedChainId] = useState(chainsSorted[0][0]);
  const [pending, SetPending] = useState(false);
  const [dispatchErr, SetDispatchErr] = useState();

  const handleChange = (event) => {
    const target = event.target;
    const id = target.id;
    if (id == 'select-session-height') {
      setHeight(target.value);
    }
    else if (id == 'select-chain') {
      setSelectedChainId(target.value);
    }
  };

  const handleSubmit = async (event) => {
    SetPending(true);
    event.preventDefault();

    try {
      await onDispatchRequest(
        height,
        selectedChainId,
      );
      SetDispatchErr('');
    }
    catch (e) {
      SetDispatchErr(e);
    }
    finally {
      SetPending(false);
    }
  };

  return (
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4 w-full
      flex flex-col"
      onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="select-session-height"
          className="block text-gray-700 text-sm font-bold mb-2">
          Height (Latest: {dispatchInfo.height})
        </label>
        <input type="number" id="select-session-height"
          value={height} min={0}
          className="shadow appearance-none border rounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label htmlFor="select-chain"
            className="block text-gray-700 text-sm font-bold mb-2">
            Chain ID
        </label>
        <div className="relative">
          <select id="select-chain"
            onChange={handleChange}
            className="shadow appearance-none w-full border
              text-gray-700 py-3 px-4 pr-8 rounded leading-tight
              focus:outline-none focus:shadow-outline focus:bg-white">
            {chainsSorted.map(([chainId, chainDesc], idx) =>
              <option key={idx} value={chainId}>{chainDesc}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex
            items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <SpinnerButton
          type="submit"
          className="inline-flex
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2
            rounded focus:outline-none focus:shadow-outline mt-4 px-4
            transition ease-in-out duration-150"
          label="Dispatch Request"
          labelPending="Dispatching..."
          isPending={pending}
          />
      </div>
      <PocketError err={dispatchErr} />
    </form>
  );
}
