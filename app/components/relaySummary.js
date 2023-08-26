'use client';
import { UrlForDisplay } from "../utils";

export default function RelaySummary({agg}) {
  return (
    <table className="table-auto shadow appearance-none border rounded w-full py-2 px-3
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm">
      <thead>
        <tr>
          <th className="p-4 text-left">Url</th>
          <th className="text-left">Elapsed Avg.</th>
          <th className="text-center"
            title="# of Majority responses/All responses">Validity</th>
        </tr>
      </thead>
      <tbody>
        {agg.resultsGroupByNode().map(({
          node,
          majorResps,
          minorResps,
          elapsedTimeAvgInMSec,
        }) =>
          <tr key={node.address}>
            <td className="ps-2">{UrlForDisplay(node.serviceUrl)}</td>
            <td>
              {elapsedTimeAvgInMSec <= 0
                ? ""
                : elapsedTimeAvgInMSec.toFixed(2) + ' ms'}
            </td>
            <td className="text-center">{majorResps}/{majorResps + minorResps}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
