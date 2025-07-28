import { APIGatewayEvent, Context } from 'aws-lambda';
import fetchRootSpans from "./lambdaFetchRootSpans/fetchRootSpans.js";
import getPhoenixKey from "../../shared/getPhoenixKey.js";
import insertRootSpans from "./lambdaRDS/insertRootSpans.js";
import createDbClient from "../../shared/createDbClient.js";
import getLatestRootSpanStartTime from "./lambdaRDS/getLastRootSpan.js";

export const handler = async (event: APIGatewayEvent) => {
  let client;

  try {
    const phoenixKey = await getPhoenixKey();

    client = createDbClient();
    await client.connect();
    let latestRootSpanStartTime = await getLatestRootSpanStartTime(client);

    const rootSpans = await fetchRootSpans(phoenixKey);

    if (!rootSpans || rootSpans.length === 0) {
      console.log('No root spans found');
      return {
        statusCode: 204, // No Content
        body: '',
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    await insertRootSpans(client, rootSpans)

    return {
      statusCode: 200,
      body: JSON.stringify(rootSpans),
      headers: {
        'Content-Type': 'application/json'
      }
    };

  } catch (error: any) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || 'Internal Server Error' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } finally {
    if (client) {
      await client.end();
      console.log('DB client closed.');
    }
  }
}