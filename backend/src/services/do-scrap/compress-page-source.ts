import { load } from "cheerio";
import { compress } from "shrink-string";

export default async function compressPageSource(htmlContent: string) {
  // load html
  const $ = load(htmlContent);

  // remove scripts so that the size would be smaller
  $("script").remove();

  // remove search form
  $("#searchform").remove();

  // compress html so it would be smaller
  return await compress($.html());
}
