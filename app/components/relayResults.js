'use client';
import { useState } from "react";
import RelayResponse from "./relayResponses";
import RelaySummary from "./relaySummary";
import { RelayResultAggregator } from "./relayAggregator";

export default function RelayResults({results}) {
  if (!results) {
    return <div />
  }

  const [respOpened, setRespOpened] = useState(-1);
  const showHideDropdown = (respIndex) =>
    setRespOpened(respIndex == respOpened ? -1 : respIndex);

  const [selectedTab, SelectTab] = useState(0);
  const onSelectTab = (event) => {
    const idToTabIndex = {
      'button-summary': 0,
      'button-responses': 1,
    }
    if (event.target.id in idToTabIndex) {
      SelectTab(idToTabIndex[event.target.id]);
      setRespOpened(-1);
    }
  };

  const agg = new RelayResultAggregator(results);

  const getTabClassNames = (idx) => {
    const commonStyle = "w-1/2 h-12 rounded-t-lg";
    const selectedOrNot = idx == selectedTab
      ? " bg-blue-500 hover:bg-blue-500"
      : " bg-blue-100 hover:bg-blue-500";
    const leftOrRight = idx == 0
      ? " ms-2" : " me-2";
    return commonStyle + selectedOrNot + leftOrRight;
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4
        text-gray-700 w-full">
      <div className="flex mb-4 border-solid border-b-4 border-blue-500">
        <button id="button-summary" type="button"
          className={getTabClassNames(0)}
          onClick={onSelectTab}>
          Summary
        </button>
        <button id="button-responses" type="button"
          className={getTabClassNames(1)}
          onClick={onSelectTab}>
          Responses
        </button>
      </div>

      <div id="tab-summary"
        style={{display: selectedTab == 0 ? 'inherit' : 'none'}}>
        <RelaySummary agg={agg} />
      </div>

      <div id="tab-responses"
        style={{display: selectedTab == 1 ? 'inherit' : 'none'}}>
        {agg.resultsGroupByResponse().map((r, idx) =>
          <RelayResponse
            key={idx}
            respIndex={idx}
            response={r.response}
            nodesAndOccurrences={r.nodesAndOccurrences}
            isMajor={r.isMajor}
            isError={r.isError}
            isOpened={respOpened == idx}
            showHideDropdown={showHideDropdown}
          />
        )}
      </div>
    </div>
  );
}
