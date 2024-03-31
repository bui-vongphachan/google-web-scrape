const { Client } = require("pg");

const pgClient = new Client({
  connectionString:
    "postgres://default:U5rg2zxCkKDa@ep-soft-field-a1v1s7ak-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require",
});

async function connectToDatabase() {
  await pgClient.connect();
}

module.exports = { pgClient, connectToDatabase };
