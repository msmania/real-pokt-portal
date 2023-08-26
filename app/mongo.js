import { MongoClient, ServerApiVersion } from "mongodb";

let dataLoaded = false;

const globalData = {};

export async function LoadDB(forceLoad) {
  if (!forceLoad && dataLoaded) {
    return globalData;
  }

  const client = new MongoClient(
    process.env.MONGO_CONN_STR, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();

    const db = client.db("portal");
    const collParams = db.collection('parameters');
    const collExamples = db.collection('payload-examples');

    const params = await collParams.findOne();
    delete params._id;
    globalData.params = params;

    const examples = await collExamples.find().toArray();
    examples.forEach(x => {
      delete x._id;
      x.messages.sort((a, b) =>
        (a.path ?? a.method) < (b.path ?? b.method)
          ? -1
          : (a.path ?? a.method) > (b.path ?? b.method)
            ? 1 : 0
      ) ;
    });
    globalData.examples = examples;

    dataLoaded = true;
    return globalData;
  }
  catch (e) {
    console.debug(e.message);
  }
  finally {
    await client.close();
  }

  return {};
}
