import { Page } from "puppeteer";

export default async function getDataFromWeb(page: Page) {
  return await page.evaluate(() => {
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
}
