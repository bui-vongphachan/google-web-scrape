import { Client } from "pg";

export const pgClient = new Client({
  connectionString: process.env.POSTGRES_URI
});

export async function startPostgre() {
  await pgClient.connect();
}
