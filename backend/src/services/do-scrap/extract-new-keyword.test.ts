import extractNewKeywords from "./extract-new-keyword";
import { sequalizeClient } from "../../lib/sequalize";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "path/to/database.sqlite",
});

describe("extract-new-keyword", () => {
  // Mocking the pgClient query function

  beforeAll(async () => {
    await sequelize.authenticate({ logging: false });
    await sequelize.sync({ logging: false });

    // create table if it doesn't exist
    await sequelize.query(
      `CREATE TABLE IF NOT EXISTS page_source_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        keyword TEXT NOT NULL
      );`
    );
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await sequelize.close();
  });

  afterEach(async () => {
    // clear the table before each test
    await sequelize.query("DELETE FROM page_source_codes");
    jest.clearAllMocks();
  });

  it("should return an empty array if no keywords are provided", async () => {
    const result = await extractNewKeywords([], sequelize);
    expect(result).toEqual([]);
  });

  it("should return an empty array if all keywords already exist", async () => {
    // insert into the database
    sequelize.query(
      `INSERT INTO page_source_codes (keyword) VALUES ('keyword1'), ('keyword2')`
    );

    // call the function
    const result = await extractNewKeywords(
      ["keyword1", "keyword2"],
      sequelize
    );

    expect(result).toEqual([]);
  });

  it("should return the new keywords that do not exist", async () => {
    // insert into the database
    sequelize.query(
      `INSERT INTO page_source_codes (keyword) VALUES ('keyword1'), ('keyword2')`
    );

    // call the function
    const result = await extractNewKeywords(
      ["keyword3", "keyword4"],
      sequelize
    );

    expect(result).toEqual(["keyword3", "keyword4"]);
  });

  it("should handle an error gracefully and return an empty array", async () => {
    const secondSequelize = new Sequelize({
      dialect: "sqlite",
      storage: "path/to/database.sqlite",
    });

    // stop the database connection so that it would cause errors
    await secondSequelize.close();

    // call the function
    const result = await extractNewKeywords(
      ["keyword3", "keyword4"],
      secondSequelize
    );

    expect(result).toEqual([]);
  });
});
