const express = require("express");
const cors = require("cors");
const compression = require("compression");
const { listenToQueue } = require("./lib/consumer");
const { connectToDatabase } = require("./lib/postgre");

const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));

app.use(compression());

app.listen(8000, async () => {
  console.log("Server started on port 8000");

  await connectToDatabase();

  await listenToQueue();
});
