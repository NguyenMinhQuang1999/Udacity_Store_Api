import dotenv from 'dotenv';
// import { Pool } from 'pg';
import Pool from 'pg-pool';

dotenv.config();

const {
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  ENV,
  POSTGRES_PORT
} = process.env;

let client;
console.log(ENV);

if (ENV === 'test') {
  client = new Pool({
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT as unknown as number
  });
}

if (ENV === 'dev') {
  client = new Pool({
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT as unknown as number
  });
}

export default client;
