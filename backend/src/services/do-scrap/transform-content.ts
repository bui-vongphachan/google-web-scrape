export default function transformContent(keywords: string[]) {
  // removed empty string and making them lower case
  return keywords.map((keyword) => keyword.toLowerCase().replace(/\s/g, ""));
}
