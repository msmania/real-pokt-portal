import { SortBy } from "../utils";

export class RelayResultAggregator {
  static SetOrUpdate(map, key, initialValue, updater) {
    if (!map.has(key)) {
      map.set(key, initialValue);
      return map;
    }

    const curVal = map.get(key);
    map.set(key, updater(curVal));
    return map;
  }

  // The structure of `results` is like this.
  // [
  //   {
  //     node,
  //     results: [
  //       // success
  //       {
  //         response,
  //         isSorted,
  //         elapsedInNSec,
  //       },
  //       // failure
  //       {
  //         reason,
  //       }
  //     ]
  //   }
  // ]
  constructor(results) {
    const numNodes = results.length;

    this.nodes = new Array(numNodes);

    // Per-node results
    this.responsesSet = new Array(numNodes);
    this.numOfErrors = new Array(numNodes);
    this.elapsedTimesArray = new Array(numNodes);

    // Cross-node results
    // Response -> nodeIndex -> occurrences
    this.totalResponseSet = new Map();
    this.totalErrorSet = new Map();

    for (let idx = 0; idx < results.length; ++idx) {
      const {node, results: nodeResults} = results[idx];
      const url = node.serviceUrl;
      this.nodes[idx] = node;
      this.responsesSet[idx] = new Map();
      this.numOfErrors[idx] = 0;
      this.elapsedTimesArray[idx] = [];

      for (const result of nodeResults) {
        if ('response' in result) {
          // Successful result
          const responseStr =
            typeof(result.response) == 'string'
              ? result.response
              : JSON.stringify(result.response, '', '  ');

          RelayResultAggregator.SetOrUpdate(
            this.responsesSet[idx], responseStr, 1, x => x + 1);
          RelayResultAggregator.SetOrUpdate(
            this.totalResponseSet,
            responseStr,
            new Map().set(url, 1),
            m => RelayResultAggregator.SetOrUpdate(m, url, 1, x => x + 1)
          );
          this.elapsedTimesArray[idx].push(result.elapsedInNSec / 1000000);
        }
        else {
          // Faiied result
          const reasonStr = JSON.stringify(result.reason, '', '  ');

          ++this.numOfErrors[idx];

          RelayResultAggregator.SetOrUpdate(
            this.totalErrorSet,
            reasonStr,
            new Map().set(url, 1),
            m => RelayResultAggregator.SetOrUpdate(m, url, 1, x => x + 1)
          );
        }
      }
    }

    this.majorResponses = new Set();

    // Find out which response is the majority
    let maxOccur = 0;
    this.totalResponseSet.forEach((m, resp) => {
      if (m.size > maxOccur) {
        maxOccur = m.size;
        this.majorResponses = new Set([resp]);
      }
      else if (m.size == maxOccur) {
        this.majorResponses.add(resp);
      }
    });

    // Calculate the average of elapsed times
    this.elapsedTimesAvg = this.elapsedTimesArray.map(
      times => times.length == 0
        ? 0
        : times.reduce((a, b) => a + b) / times.length);
  }

  resultsGroupByResponse() {
    const results = [];

    this.totalResponseSet.forEach((m, resp) => {
      results.push({
        response: resp,
        nodesAndOccurrences: m,
        isMajor: this.majorResponses.has(resp),
      });
    });

    this.totalErrorSet.forEach((m, resp) => {
      results.push({
        response: resp,
        nodesAndOccurrences: m,
        isError: true,
      });
    });

    return results;
  }

  resultsGroupByNode() {
    let maxElapsed = 0; 
    const results = this.nodes.map((node, idx) => {
      let majorResps = 0;
      let minorResps = this.numOfErrors[idx];

      this.responsesSet[idx].forEach((occurrences, response) => {
        if (this.majorResponses.has(response)) {
          majorResps += occurrences;
        }
        else {
          minorResps += occurrences;
        }
      });

      if (this.elapsedTimesAvg[idx] > maxElapsed) {
        maxElapsed = this.elapsedTimesAvg[idx];
      }

      return {
        node: node,
        majorResps: majorResps,
        minorResps: minorResps,
        elapsedTimeAvgInMSec: this.elapsedTimesAvg[idx],
      };
    });

    SortBy(results,
      x => x.elapsedTimeAvgInMSec == 0
        ? maxElapsed * 2 : x.elapsedTimeAvgInMSec);
    
    return results;
  }
}
