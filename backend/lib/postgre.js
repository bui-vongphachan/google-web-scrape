require("dotenv").config();
const { Client } = require("pg");

const pgClient = new Client({
  connectionString: process.env.POSTGRES_URI,
});

async function connectToDatabase() {
  await pgClient.connect();
}

module.exports = { pgClient, connectToDatabase };
