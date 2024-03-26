export function generateUniqueIdentifier() {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
  const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string
  const uniqueIdentifier = timestamp + randomString; // Concatenate timestamp and random string

  // Ensure the identifier is less than forty characters long
  if (uniqueIdentifier.length > 40) {
    return uniqueIdentifier.substring(0, 40);
  }

  return uniqueIdentifier;
}
