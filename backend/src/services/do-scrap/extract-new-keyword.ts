import { Sequelize } from "sequelize";

export default async function extractNewKeywords(
  keywords: string[],
  sequalizeClient: Sequelize
) {
  // validate input
  if (keywords.length === 0) return [];

  // add single quote to each keyword
  // so that it can be used in the query
  const singleQuotedKeywords = keywords.map((item) => `'${item}'`).join(",");

  // build the query
  const query = `SELECT keyword FROM page_source_codes WHERE keyword IN (${singleQuotedKeywords}) LIMIT 100`;

  // find the existing keywords
  let existingKeywordObjects = await sequalizeClient
    .query(query)
    .then((res) => res[0] as any)
    .catch((err) => {
      console.log(err);
      return null;
    });

  console.log({ existingKeywordObjects });

  // return empty there is error
  if (existingKeywordObjects === null) return [];

  // convert form array of objects into array of strings
  const existingKeywords = existingKeywordObjects.map(
    (item: any) => item.keyword as string
  );

  // remove the existing keywords from the new keywords
  return keywords.filter((keyword) => !existingKeywords.includes(keyword));
}
