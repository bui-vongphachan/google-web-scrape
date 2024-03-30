const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const UserAgent = require("user-agents");
const cors = require("cors");
const cheerio = require("cheerio");
const compression = require("compression");
const { compress } = require("shrink-string");

puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());

const userAgent = new UserAgent({ deviceCategory: "desktop" });
const randomUserAgent = userAgent.random().toString();

const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));

app.use(compression());

app.post("/api/search", async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--user-agent=" + randomUserAgent],
  });

  const keywords = req.body.keywords;

  console.log({ keywords });

  if (keywords.length === 0) return res.json([]);

  const pending = keywords.map(async (keyword) => {
    const encodedKeyword = encodeURIComponent(keyword);

    const pageUrl = "https://www.google.com/search?q=" + encodedKeyword;

    const page = await browser.newPage();

    await page.setUserAgent(randomUserAgent);

    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });

    const html = await page.evaluate(() => {
      //   const selector = `div[id="rso"]`;

      const selector = `body`;

      const el = document.querySelector(selector);

      return el.innerHTML;
    });

    await page.close();

    const $ = cheerio.load(html);

    $("script").remove();

    // $("style").remove();

    const shrunk = await compress($.html());

    return { [keyword]: shrunk };
  });

  const content = await Promise.all(pending);

  await browser.close();

  return res.json(content);
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});
