import { Relay } from "@/app/pocket";

function convertResult(result) {
  if (result.status != 'fulfilled') {
    return result;
  }

  return {
    response: result.value.response,
    relayProof: result.value.relayProof,
    elapsedInNSec: result.value.elapsedInNSec.toString(),
  };
}

function convertResultsOnNode(results) {
  if (results.status != 'fulfilled') {
    return results;
  }

  return results.value.map(convertResult);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const results = await Relay(
      body.network,
      body.session,
      body.relayPlan,
      body.payload,
    );
    const resultsReplaced = results.map(convertResultsOnNode);
    return Response.json(resultsReplaced);
  }
  catch (e) {
    return Response.json(e);
  }
}
