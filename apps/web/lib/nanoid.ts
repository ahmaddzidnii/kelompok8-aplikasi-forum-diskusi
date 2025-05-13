export const nanoid = (size: number) => {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const randomBytes = new Uint8Array(size);
  crypto.getRandomValues(randomBytes);
  return Array.from(
    randomBytes,
    (byte) => alphabet[byte % alphabet.length],
  ).join("");
};
