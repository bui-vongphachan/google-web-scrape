import { pgClient } from "../../lib/startPostgre";

export default async function extractNewKeywords(keywords: string[]) {
  // validate input
  if (keywords.length === 0) return [];

  // add single quote to each keyword
  // so that it can be used in the query
  const singleQuotedKeywords = keywords.map((item) => `'${item}'`).join(",");

  // build the query
  const query = `SELECT keyword FROM page_source_codes WHERE keyword IN (${singleQuotedKeywords}) LIMIT 100`;

  // find the existing keywords
  let existingKeywordObjects = await pgClient
    .query(query)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err);
      return null;
    });

  // return empty there is error
  if (existingKeywordObjects === null) return [];

  // convert form array of objects into array of strings
  const existingKeywords = existingKeywordObjects.map(
    (item) => (item.keyword as string) || ""
  );

  // remove the existing keywords from the new keywords
  return keywords.filter((keyword) => !existingKeywords.includes(keyword));
}
