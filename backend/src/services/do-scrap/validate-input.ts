export default function validateInput(content: unknown): string[] {
  // check if is string
  if (typeof content !== "string") return [];

  // check if is empty
  if (content === "") return [];

  // check if is array
  try {
    if (!Array.isArray(JSON.parse(content))) return [];
  } catch (error) {
    return [];
  }

  // convert content strings to array
  const contentArray = JSON.parse(content);

  // check if array is empty
  if (contentArray.length === 0) return [];

  return contentArray;
}
