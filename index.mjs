import fetchRootSpans from "./lambdaFetchRootSpans/fetchRootSpans.mjs";
import getPhoenixKey from "./lambdaFetchRootSpans/getPhoenixKey.mjs";
import insertRootSpans from "./lambdaRDS/insertRootSpans.mjs";
import { Client } from 'pg';


export const handler = async (event) => {
  const phoenixKey = await getPhoenixKey();

  const rootSpans = await fetchRootSpans(phoenixKey);

  if(!rootSpans) console.log('No root spans found')

  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || "5432", 10),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  insertRootSpans(client, rootSpans)

  return rootSpans;
}