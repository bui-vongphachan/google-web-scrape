import puppeteer from "puppeteer-extra";
import UserAgent from "user-agents";
import { executablePath } from "puppeteer";
import validateInput from "./validate-input";
import transformContent from "./transform-content";
import extractNewKeywords from "./extract-new-keyword";
import visitSite from "./visit-site";
import getDataFromWeb from "./get-data-from-web";
import compressPageSource from "./compress-page-source";
import { Sequelize } from "sequelize";

export default async function doScraping(
  content: unknown,
  sequalizeClient: Sequelize
) {
  // validate input
  const keywords = validateInput(content);

  const transformedKeywords = transformContent(keywords);

  const newKeywords = await extractNewKeywords(
    transformedKeywords,
    sequalizeClient
  );

  const userAgent = new UserAgent({ deviceCategory: "desktop" });

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
    args: ["--no-sandbox", "--user-agent=" + userAgent.random().toString()],
  });

  for (let i = 0; i < newKeywords.length; i++) {
    const keyword = newKeywords[i];

    const page = await visitSite(keyword, browser, userAgent);

    const webContent = await getDataFromWeb(page);

    await page.close();

    const compressedContent = await compressPageSource(webContent.mainContent);

    await sequalizeClient.query(
      `
      INSERT INTO page_source_codes
        (keyword, compressed_source_code, total_links, adwords, stats)
      VALUES
        (:keyword, :compressed_source_code, :total_links, :adwords, :stats)
      `,
      {
        replacements: {
          keyword: keyword,
          compressed_source_code: compressedContent,
          total_links: JSON.stringify(webContent.totalLinks),
          adwords: JSON.stringify(webContent.adWords),
          stats: JSON.stringify(webContent.stats),
        },
      }
    );
  }
}
