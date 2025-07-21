import { Client } from 'pg';

const createDbClient = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  console.log('Creating db client');
  const client = new Client({
    host: isProduction ? process.env.PGHOST : process.env.LOCALPGHOST,
    port: 5432,
    user: isProduction ? process.env.PGUSER : process.env.LOCALPGUSER,
    password: isProduction ? process.env.PGPASSWORD : process.env.LOCALPGPASSWORD,
    database: isProduction ? process.env.PGDATABASE : process.env.LOCALPGDATABASE,
    ssl: isProduction
      ? { rejectUnauthorized: false }  // use SSL in prod (RDS)
      : undefined,                     // no SSL locally
  });

  return client
}

export default createDbClient