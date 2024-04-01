import { Browser } from "puppeteer";
import UserAgent from "user-agents";

export default async function visitSite(
  keyword: string,
  browser: Browser,
  userAgent: UserAgent
) {
  // encoded keyword
  const encodedKeyword = encodeURIComponent(keyword);

  const pageUrl = "https://www.google.com/search?q=" + encodedKeyword;

  // open new tab
  const page = await browser.newPage();

  const randomUserAgent = userAgent.random().toString();

  // set user agent
  await page.setUserAgent(randomUserAgent);

  // visit page and wait until page is loaded
  await page.goto(pageUrl, { waitUntil: "domcontentloaded" });

  return page;
}
