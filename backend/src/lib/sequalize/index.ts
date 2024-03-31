import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

export const sequalizeClient = new Sequelize(
  process.env.POSTGRES_URI as string
);
