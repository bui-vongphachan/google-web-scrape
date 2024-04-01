import { Page } from "puppeteer";

export default async function getDataFromWeb(page: Page) {
  console.log(page.evaluate);
  /* istanbul ignore next */
  return await page
    .evaluate(() => {
      console.log(`page.evaluate`);
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
    })
    .catch((err) => {
      console.log({ err });
      return {
        mainContent: "unable to load",
        stats: "unable to load",
        totalLinks: 0,
        adWords: 0,
      };
    });
}
