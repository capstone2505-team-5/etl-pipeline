import fetchRootSpans from "./lambdaFetchRootSpans/fetchRootSpans.mjs";
import getPhoenixKey from "./lambdaFetchRootSpans/getPhoenixKey.mjs";
import insertRootSpans from "./lambdaRDS/insertRootSpans.mjs";
import createDbClient from "./lambdaRDS/createDbClient.mjs";

export const handler = async (event) => {
  const phoenixKey = await getPhoenixKey();

  const rootSpans = await fetchRootSpans(phoenixKey);

  if(!rootSpans) console.log('No root spans found')

  const client = createDbClient();
  await client.connect();
  await insertRootSpans(client, rootSpans)

  return {
    statusCode: 200,
    body: JSON.stringify(rootSpans),
    headers: {
      'Content-Type': 'application/json'
    }
  };
}