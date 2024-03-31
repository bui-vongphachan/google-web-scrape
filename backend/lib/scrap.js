const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const UserAgent = require("user-agents");
const cheerio = require("cheerio");
const { compress } = require("shrink-string");
const { executablePath } = require("puppeteer");
const { pgClient } = require("../lib/postgre");

puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());

async function doScraping(content) {
  const keywords = JSON.parse(content);

  if (!keywords) return;

  if (keywords.length === 0) return;

  // removed empty string, making them lower case
  const transformedKeywords = keywords.map((keyword) =>
    keyword.toLowerCase().replace(/\s/g, "")
  );

  console.log({ transformedKeywords });

  const existingKeywords = await pgClient
    .query(
      `SELECT * FROM page_source_codes WHERE keyword IN (${transformedKeywords.join(
        ","
      )}) LIMIT 100`,
      []
    )
    .then((res) => {
      console.log(res.command);
      return res.rows;
    })
    .catch((err) => {
      console.log(err);
    });

  console.log({ existingKeywords });

  return;

  const newKeywords = transformedKeywords.filter(
    (keyword) => !existingKeywords.includes(keyword)
  );

  const userAgent = new UserAgent({ deviceCategory: "desktop" });

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
    args: ["--user-agent=" + userAgent.random().toString()],
  });

  for (let i = 0; i < newKeywords.length; i++) {
    const keyword = newKeywords[i];

    const encodedKeyword = encodeURIComponent(keyword);

    const pageUrl = "https://www.google.com/search?q=" + encodedKeyword;

    const page = await browser.newPage();

    const randomUserAgent = userAgent.random().toString();

    await page.setUserAgent(randomUserAgent);

    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });

    const html = await page.evaluate(() => {
      const selector = `body`;

      const el = document.querySelector(selector);

      return {
        mainContent: el.innerHTML,
        stats: "el.outerHTML",
        totalLinks: 0,
        adWords: 0,
      };
    });

    await page.close();

    const $ = cheerio.load(html.mainContent);
    // remove scripts so that the size would be smaller
    $("script").remove();

    $("#searchform").remove();

    const compressedFile = await compress($.html());

    const query = {
      text: `INSERT INTO page_source_codes (keyword, compressed_source_code) VALUES ($1, $2)`,
      values: [keyword, compressedFile],
    };
    await pgClient.query(query).catch((err) => {
      console.log(err);
    });
  }

  console.log("DONE!!!");
}

module.exports = { doScraping };
