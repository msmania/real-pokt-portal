'use client';
import { useState } from "react";
import { GetTextAreaHeight, UrlForDisplay } from "../utils";

function MajorMark() {
  return (
    <svg fill="#000000" width="32px" height="32px"
      className="me-2"
      viewBox="-3 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>This is the majority response.</title>
      <path d="M20.906 20.75c1.313 0.719 2.063 2 1.969 3.281-0.063 0.781-0.094 0.813-1.094 0.938-0.625 0.094-4.563 0.125-8.625 0.125-4.594 0-9.406-0.094-9.75-0.188-1.375-0.344-0.625-2.844 1.188-4.031 1.406-0.906 4.281-2.281 5.063-2.438 1.063-0.219 1.188-0.875 0-3-0.281-0.469-0.594-1.906-0.625-3.406-0.031-2.438 0.438-4.094 2.563-4.906 0.438-0.156 0.875-0.219 1.281-0.219 1.406 0 2.719 0.781 3.25 1.938 0.781 1.531 0.469 5.625-0.344 7.094-0.938 1.656-0.844 2.188 0.188 2.469 0.688 0.188 2.813 1.188 4.938 2.344zM3.906 19.813c-0.5 0.344-0.969 0.781-1.344 1.219-1.188 0-2.094-0.031-2.188-0.063-0.781-0.188-0.344-1.625 0.688-2.25 0.781-0.5 2.375-1.281 2.813-1.375 0.563-0.125 0.688-0.469 0-1.656-0.156-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.25-2.313 1.438-2.719 1-0.375 2.125 0.094 2.531 0.938 0.406 0.875 0.188 3.125-0.25 3.938-0.5 0.969-0.406 1.219 0.156 1.375 0.125 0.031 0.375 0.156 0.719 0.313-1.375 0.563-3.25 1.594-4.219 2.188zM24.469 18.625c0.75 0.406 1.156 1.094 1.094 1.813-0.031 0.438-0.031 0.469-0.594 0.531-0.156 0.031-0.875 0.063-1.813 0.063-0.406-0.531-0.969-1.031-1.656-1.375-1.281-0.75-2.844-1.563-4-2.063 0.313-0.125 0.594-0.219 0.719-0.25 0.594-0.125 0.688-0.469 0-1.656-0.125-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.219-2.313 1.406-2.719 1.031-0.375 2.156 0.094 2.531 0.938 0.406 0.875 0.25 3.125-0.188 3.938-0.5 0.969-0.438 1.219 0.094 1.375 0.375 0.125 1.563 0.688 2.75 1.313z"></path>
    </svg>
  );
}

function ErrorMark() {
  return (
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"
      className="me-2"
      xmlns="http://www.w3.org/2000/svg">
      <title>This is an error response.</title>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.91 3.23 3.23 7.913v-.01a.81.81 0 0 0-.23.57v7.054c0 .22.08.42.23.57L7.9 20.77c.15.15.36.23.57.23h7.06c.22 0 .42-.08.57-.23l4.67-4.673a.81.81 0 0 0 .23-.57V8.473c0-.22-.08-.42-.23-.57L16.1 3.23a.81.81 0 0 0-.57-.23H8.48c-.22 0-.42.08-.57.23ZM12 7a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm-1 9a1 1 0 0 1 1-1h.008a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z" fill="#000000"/>
    </svg>
  );
}

function QuestionMark() {
  return (
    <svg width="16px" height="16px" viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg" fill="#000000"
      className="me-2">
      <title>This is a minor response.</title>
      <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
    </svg>
  );
}

export default function RelayResponse({
  respIndex,
  response,
  nodesAndOccurrences,
  isMajor,
  isError,
  isOpened,
  showHideDropdown,
}) {
  let occurrences = 0;
  nodesAndOccurrences.forEach((v, k) => occurrences += v);
  const description = nodesAndOccurrences.size == 1
    ? `${occurrences}x from ${nodesAndOccurrences.keys().next().value}`
    : `${occurrences}x from ${nodesAndOccurrences.size} nodes`;

  return (
    <div>
      <div className="relative">
        <button type="button"
          className="w-full bg-gray-400 h-12
            flex flex-row items-center justify-start ps-4"
          onClick={event => showHideDropdown(respIndex)}>
          {isMajor ? <MajorMark /> : isError ? <ErrorMark /> : <QuestionMark />}
          {description}
        </button>
        <ul className="absolute w-2/3 right-0 bg-gray-300 p-2 z-10"
          style={{display: isOpened ? 'block' : 'none'}}>
          {[...nodesAndOccurrences].map(([node, occur]) =>
            <li key={node}
              className="break-words text-sm ms-2"
              title={node}>
              {occur}x from {UrlForDisplay(node)}
            </li>)}
        </ul>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex
          items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      <textarea value={response} readOnly
        className="w-full font-mono text-sm"
        spellCheck="false"
        style={{height: GetTextAreaHeight(response, 4, 30)}}
      />
    </div>
  );
}
