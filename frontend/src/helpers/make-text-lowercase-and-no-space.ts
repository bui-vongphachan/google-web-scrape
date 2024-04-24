export default function makeTextLowercaseAndNoSpace(text: string): string {
  return text.toLowerCase().replace(/\s/g, "");
}
