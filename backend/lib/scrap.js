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

  const stringifiedKeywords = transformedKeywords
    .map((item) => `'${item}'`)
    .join(",");

  const query = `SELECT keyword FROM page_source_codes WHERE keyword IN (${stringifiedKeywords}) LIMIT 100`;

  let existingKeywords = await pgClient
    .query(query)
    .then((res) => res.rows)
    .catch((err) => console.log(err));

  existingKeywords = existingKeywords.map((item) => item.keyword);

  const newKeywords = transformedKeywords.filter(
    (keyword) => !existingKeywords.includes(keyword)
  );

  console.log("New keywords: ", newKeywords);

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
      const el = document.querySelector(`body`);

      const stats = document.querySelector(`#result-stats`);

      const elements = document.querySelectorAll(`div[data-text-ad="1"]`);

      const links = document.querySelectorAll(`a`);

      return {
        mainContent: el ? el.innerHTML : "no content",
        stats: stats ? stats.innerHTML : "no content",
        totalLinks: links.length,
        adWords: elements.length,
      };
    });

    await page.close();

    const $ = cheerio.load(html.mainContent);

    // remove scripts so that the size would be smaller
    $("script").remove();

    $("#searchform").remove();

    const compressedFile = await compress($.html());

    const query = {
      text: `
              INSERT INTO page_source_codes 
                (keyword, compressed_source_code, total_links, adwords, stats) 
              VALUES 
                ($1, $2, $3, $4, $5)
            `,
      values: [
        keyword,
        compressedFile,
        html.totalLinks,
        html.adWords,
        html.stats,
      ],
    };
    await pgClient.query(query).catch((err) => {
      console.log(err);
    });
  }

  console.log("DONE!!!");
}

module.exports = { doScraping };
