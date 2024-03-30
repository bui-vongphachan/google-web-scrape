const defaultData = {
  items: [],
};

export default async function getGoogleCustomSearchResult(keyword: unknown) {
  if (!keyword) return defaultData;

  if (typeof keyword !== "string") return defaultData;

  if (keyword === "") return defaultData;

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_API_KEY}&cx=${process.env.NEXT_PUBLIC_CONTEXT_KEY}&q=${keyword}`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return defaultData;
  }
}
