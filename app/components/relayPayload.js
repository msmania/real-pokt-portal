'use client';
import { useEffect, useState } from "react";
import { GetTextAreaHeight } from "../utils";

export default function RelayPayload({
  chainId,
  dispatchInfo,
  payload,
  setPayload,
}) {
  const [selected, setSelected] = useState(0);
  const [modified, setModified] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState('4rem');

  let examplesForChain = [];
  useEffect(() => {
    if (!modified
      && examplesForChain
      && selected < examplesForChain.length) {
      const newPayload = examplesForChain[selected].payload;
      setPayload(newPayload);
      setTextareaHeight(GetTextAreaHeight(newPayload, 4, 20));
    }
  }, [examplesForChain]);

  const chainType =
    (chainId in dispatchInfo.chains && dispatchInfo.chains[chainId])
    ? dispatchInfo.chains[chainId][1]
    : null;
  const examples = chainType
    ? dispatchInfo.examples.filter(x => x.type == chainType)
    : dispatchInfo.examples;
  if (examples && examples.length >= 1) {
    const messages =
      examples.reduce((a, b) => a.concat(b.messages), []);
    examplesForChain = messages.map(
      message => ({
        title: message?.path ?? message?.method,
        payload: JSON.stringify(message, '', '  '),
      }));
  }

  const handleInput = (event) => {
    setModified(true);
    setPayload(event.target.value);
  };

  const handleSelect = (event) => {
    setModified(false);
    setSelected(parseInt(event.target.value));
  }

  return (
    <div className="bg-white rounded px-8 pt-6 pb-8
        text-gray-700 w-full flex flex-col shadow appearance-none border">
      <div className="relative">
        <select id="select-chain"
          onChange={handleSelect}
          className="shadow appearance-none w-full border
            text-gray-700 py-3 px-4 pr-8 rounded leading-tight
            focus:outline-none focus:shadow-outline focus:bg-white">
          {examplesForChain.map((example, idx) =>
            <option key={idx} value={idx}>{example.title}</option>)}
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
      <textarea value={payload} onChange={handleInput}
        className="w-full font-mono text-sm p-2"
        spellCheck="false"
        style={{height: textareaHeight}}
        />
    </div>
  );
}
