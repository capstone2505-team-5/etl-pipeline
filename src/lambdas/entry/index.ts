import { APIGatewayEvent } from "aws-lambda"
import getPhoenixKey from "../../shared/getPhoenixKey.js";
import createDbClient from "../../shared/createDbClient.js"
import fetchProjects from "./fetchProjects/fetchProjects.js";


export const handler = async (event: APIGatewayEvent) => {
  let client;

  try {
    const phoenixKey = await getPhoenixKey();

    client = createDbClient();
    await client.connect();

    let projects = await fetchProjects(phoenixKey);

  //   const rootSpans = await fetchRootSpans(phoenixKey, latestRootSpanStartTime);

  //   if (!rootSpans || rootSpans.length === 0) {
  //     console.log('No root spans found');
  //     return {
  //       statusCode: 204, // No Content
  //       body: '',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     };
  //   }

  //   await insertRootSpans(client, rootSpans)

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify(rootSpans),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   };

  // } catch (error: any) {
  //   console.error('Error in handler:', error);
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ message: error.message || 'Internal Server Error' }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };
  } finally {
    if (client) {
      await client.end();
      console.log('DB client closed.');
    }
  }
  // // 1. Get all projects
  // const projects = await getAllProjects();

  // if (!projects.length) {
  //   console.log("No projects found.");
  //   return;
  // }

  // // 2. Trigger worker lambdas for each project
  // const invocations = projects.map((project) =>
  //   invokeProjectIngestionLambda(project.id)
  // );

  // await Promise.all(invocations);
  // console.log(`Triggered ingestion for ${projects.length} projects.`);
};

// async function invokeProjectIngestionLambda(projectId: string) {
//   const command = new InvokeCommand({
//     FunctionName: INGEST_PROJECT_LAMBDA,
//     InvocationType: "Event", // async invocation
//     Payload: Buffer.from(JSON.stringify({ projectId })),
//   });

//   try {
//     await lambdaClient.send(command);
//     console.log(`Triggered ingestion for project: ${projectId}`);
//   } catch (err) {
//     console.error(`Failed to invoke for project ${projectId}:`, err);
//   }



// }