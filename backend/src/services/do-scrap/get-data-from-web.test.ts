import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import getDataFromWeb from "./get-data-from-web";
import UserAgent from "user-agents";
import puppeteer, { executablePath } from "puppeteer";
import extractNewKeywords from "./extract-new-keyword";
import visitSite from "./visit-site";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "path/to/database.sqlite",
});

describe("get-data-from-web.test", () => {
  // Mocking the pgClient query function

  beforeAll(async () => {
    await sequelize.authenticate({ logging: false });
    await sequelize.sync({ logging: false });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should return an object with the correct properties", async () => {
    const userAgent = new UserAgent({ deviceCategory: "desktop" });

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath(),
      args: ["--user-agent=" + userAgent.random().toString()],
    });

    const page = await visitSite("toy", browser, userAgent);

    const result = await getDataFromWeb(page);

    await page.close();

    expect(result).toHaveProperty("mainContent");
    expect(result).toHaveProperty("stats");
    expect(result).toHaveProperty("totalLinks");
    expect(result).toHaveProperty("adWords");

    expect(result.totalLinks).toBeGreaterThan(0);
  });
});
