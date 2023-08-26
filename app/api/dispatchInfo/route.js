import { QueryApp, QueryHeight } from "@/app/pocket";
import { LoadDB } from "@/app/mongo";

export async function POST(request) {
  try {
    const db = await LoadDB();
    const body = await request.json();
    const network = body.network;
    const app = await QueryApp(network);

    const chains = {};
    app.chains.forEach(chain => {
      chains[chain] = (chain in db.params[network].chains)
        ? db.params[network].chains[chain]
        : null;
    });

    const info = {
      height: await QueryHeight(network),
      chains,
      maxRelays: app.maxRelays,
      examples: db.examples,
    };
    return Response.json(info);
  }
  catch (e) {
    return Response.json(e.message);
  }
}
