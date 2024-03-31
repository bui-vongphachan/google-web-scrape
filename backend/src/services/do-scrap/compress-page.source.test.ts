import { Dialect, Sequelize } from "sequelize";
import { decompress } from "shrink-string";
import compressPageSource from "./compress-page-source";

process.env.SQL_DIALECT = "sqlite";
process.env.FOOD_ALLOWANCE_TYPE_ID = "1";
process.env.BUSSINESS_UNIT_STANDARD = "1";
process.env.BUSSINESS_UNIT_GOLD = "2";

const sequalizeClient = new Sequelize(
  process.env.SQL_DATABASE!,
  process.env.SQL_USER!,
  process.env.SQL_PASSWORD!,
  {
    host: process.env.SQL_HOST!,
    port: parseInt(process.env.SQL_PORT!),
    dialect: <Dialect>process.env.SQL_DIALECT!,
    logging: false,
  }
);

describe("checkDay", () => {
  beforeAll(async () => {
    console.log("beforeAll", process.env.SQL_DIALECT);
    await sequalizeClient.authenticate({ logging: false });
    await sequalizeClient.sync({ logging: false });
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await sequalizeClient.close();
  });

  it("should remove scripts and search form from the html content", async () => {
    const htmlContent = `
    <html>
      <head>
        <script src="script.js"></script>
      </head>
      <body>
        <form id="searchform">
          <input type="text" id="search" name="search" />
        </form>
        <h1>Hello World</h1>
      </body>
    </html>
    `;

    const compressedHtmlContent = await compressPageSource(htmlContent);

    const decompressedHtmlContent = await decompress(compressedHtmlContent);

    expect(decompressedHtmlContent.replace(/\s/g, "")).toEqual(
      "<html><head></head><body><h1>Hello World</h1></body></html>".replace(
        /\s/g,
        ""
      )
    );
  });

  it("should compress the html content", async () => {
    const htmlContent = `
    <html>
      <head>
        <script src="script.js"></script>
      </head>
      <body>
        <form id="searchform">
          <input type="text" id="search" name="search" />
        </form>
        <h1>Hello World</h1>
      </body>
    </html>
    `;

    const compressedHtmlContent = await compressPageSource(htmlContent);

    expect(compressedHtmlContent.length).toBeLessThan(htmlContent.length);

    expect(compressedHtmlContent.length).toBeGreaterThan(0);

    expect(compressedHtmlContent).not.toEqual(htmlContent);
  });
});
