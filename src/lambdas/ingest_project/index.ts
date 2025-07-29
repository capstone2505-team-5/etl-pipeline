import { APIGatewayEvent, Context } from 'aws-lambda';
import fetchRootSpans from "./lambdaFetchRootSpans/fetchRootSpans.js";
import getPhoenixKey from "../../shared/getPhoenixKey.js";
import insertRootSpans from "./lambdaRDS/insertRootSpans.js";
import createDbClient from "../../shared/createDbClient.js";
import getLatestRootSpanStartTime from "./lambdaRDS/getLastRootSpan.js";

export const processProjectIngestion = async (projectName: string, lastCursor: string) => {
  let client;

  try {
    const phoenixKey = await getPhoenixKey();

    client = createDbClient();
    await client.connect();
    
    let latestRootSpanStartTime = await getLatestRootSpanStartTime(client);

    const rootSpans = await fetchRootSpans(phoenixKey);

    if (!rootSpans || rootSpans.length === 0) {
      console.log('No root spans found');
      return { success: true, rootSpans: [], message: 'No root spans found' };
    }

    await insertRootSpans(client, rootSpans);

    return { success: true, rootSpans, message: 'Root spans processed successfully' };

  } catch (error: any) {
    console.error('Error in processProjectIngestion:', error);
    throw error; // Re-throw so the handler can catch and format the response
  } finally {
    if (client) {
      await client.end();
      console.log('DB client closed.');
    }
  }
};

// Updated handler
export const handler = async (event: APIGatewayEvent) => {
  let projectName = '';
  let lastCursor = '';

  // Parse the request body if present
  if (event.body) {
    try {
      const parsedBody = JSON.parse(event.body);
      console.log('Parsed body:', parsedBody);
      projectName = parsedBody.projectName || '';
      lastCursor = parsedBody.lastCursor || '';
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid JSON in request body' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }
  }

  try {
    const result = await processProjectIngestion(projectName, lastCursor);
    
    if (result.rootSpans.length === 0) {
      return {
        statusCode: 204, // No Content
        body: '',
        headers: { 'Content-Type': 'application/json' }
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.rootSpans),
      headers: { 'Content-Type': 'application/json' }
    };

  } catch (error: any) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || 'Internal Server Error' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};