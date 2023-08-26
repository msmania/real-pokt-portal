'use client';
import { useState } from "react";
import SpinnerButton from "./button";
import PocketError from "./pocketError";
import { GetJsonFetcher } from "../utils";

const JsonFetcherWithCache = GetJsonFetcher('default');

export default function SelectNetwork({
  setNetwork,
  setDispatchInfo,
}) {
  const [networkName, setNetworkName] = useState('testnet');
  const [pending, SetPending] = useState(false);
  const [networkErr, SetNetworkErr] = useState();

  const handleChange = event => setNetworkName(event.target.value);
  const handleSubmit = async event => {
    SetPending(true);
    event.preventDefault();

    try {
      const newDispatchInfo = await JsonFetcherWithCache(
        '/api/dispatchInfo',
        {network: networkName},
      );
      if (typeof(newDispatchInfo) != 'object') {
        const err = new Error('Network Error');
        err.info = {
          message: newDispatchInfo
        };
        throw err;
      }
      setNetwork(networkName);
      setDispatchInfo(newDispatchInfo);
      SetNetworkErr('');
    }
    catch (e) {
      SetNetworkErr(e);
    }
    finally {
      SetPending(false);
    }
  }

  return (
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4 w-full
      flex flex-col"
      onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="network-name"
          className="block text-gray-700 text-sm font-bold mb-2">
          Network ID
        </label>
        <input type="input" id="network-name"
          value={networkName}
          spellCheck="false"
          className="shadow appearance-none border rounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleChange} />
      </div>
      <div className="flex flex-row justify-center">
        <SpinnerButton
          type="submit"
          className="inline-flex
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2
            rounded focus:outline-none focus:shadow-outline mt-4 px-4
            transition ease-in-out duration-150"
          label="Select"
          labelPending="Loading..."
          isPending={pending}
          />
      </div>
      <PocketError err={networkErr} />
    </form>
  );
}
