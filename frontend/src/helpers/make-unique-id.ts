export function makeUniqueId() {
  // Convert current timestamp to base36 string
  const timestamp = Date.now().toString(36);

  // Generate a random string
  const randomString = Math.random().toString(36).substring(2, 10);

  // Concatenate timestamp and random string
  const uniqueIdentifier = timestamp + randomString;

  // Ensure the identifier is less than 40 characters long
  if (uniqueIdentifier.length > 40) return uniqueIdentifier.substring(0, 40);

  return uniqueIdentifier;
}
