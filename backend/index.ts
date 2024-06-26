import express from "express";
import cors from "cors";
import compression from "compression"; 
import { startPostgre } from "./src/lib/startPostgre";
import startConsumeMessage from "./src/lib/startConsumeMessage";
import { sequalizeClient } from "./src/lib/sequalize";

const app = express();

app.use(cors());

app.use(express.json());

app.use(compression());

app.listen(8000, async () => {
  console.log("Server started on port 8000");

  await startPostgre();

  await startConsumeMessage(sequalizeClient);
});
