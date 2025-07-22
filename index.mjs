import fetchRootSpans from "./lambdaFetchRootSpans/fetchRootSpans.mjs";
import getPhoenixKey from "./lambdaFetchRootSpans/getPhoenixKey.mjs";
import insertRootSpans from "./lambdaRDS/insertRootSpans.mjs";
import createDbClient from "./lambdaRDS/createDbClient.mjs";
import getLatestRootSpanStartTime from "./lambdaRDS/getLastRootSpan.mjs";

export const handler = async (event) => {
  let client;

  try {
    const phoenixKey = await getPhoenixKey();

    client = createDbClient();
    await client.connect();
    let latestRootSpanStartTime = await getLatestRootSpanStartTime(client);

    const rootSpans = await fetchRootSpans(phoenixKey, latestRootSpanStartTime);

    if(!rootSpans) console.log('No root spans found')

    await insertRootSpans(client, rootSpans)

    return {
      statusCode: 200,
      body: JSON.stringify(rootSpans),
      headers: {
        'Content-Type': 'application/json'
      }
    };

  } catch (error) {
    throw error;
  } finally {
    if (client) {
      await client.end();
      console.log('DB client closed.');
    }
  }
}