import puppeteer from "puppeteer-extra";
import UserAgent from "user-agents";
import { executablePath } from "puppeteer";
import validateInput from "./validate-input";
import transformContent from "./transform-content";
import extractNewKeywords from "./extract-new-keyword";
import visitSite from "./visit-site";
import getDataFromWeb from "./get-data-from-web";
import compressPageSource from "./compress-page-source";
import { pgClient } from "../../lib/startPostgre";

export default async function doScraping(content: unknown) {
  // validate input
  const keywords = validateInput(content);

  const transformedKeywords = transformContent(keywords);

  const newKeywords = await extractNewKeywords(transformedKeywords);

  const userAgent = new UserAgent({ deviceCategory: "desktop" });

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
    args: ["--user-agent=" + userAgent.random().toString()],
  });

  for (let i = 0; i < newKeywords.length; i++) {
    const keyword = newKeywords[i];

    const page = await visitSite(keyword, browser, userAgent);

    const webContent = await getDataFromWeb(page);

    await page.close();

    const compressedContent = await compressPageSource(webContent.mainContent);

    const saveQuery = ` INSERT INTO page_source_codes 
                          (keyword, compressed_source_code, total_links, adwords, stats) 
                        VALUES 
                          ($1, $2, $3, $4, $5)`;

    await pgClient.query(saveQuery, [
      keyword,
      compressedContent,
      JSON.stringify(webContent.totalLinks),
      JSON.stringify(webContent.adWords),
      JSON.stringify(webContent.stats),
    ]);
  }
}
