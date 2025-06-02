import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

/**
 * Gets the full HD version of a Google profile picture URL
 * @param googleAvatarUrl - The original Google avatar URL
 * @returns The URL for the full HD version
 */
function getFullHDGoogleAvatar(googleAvatarUrl: string): string {
  // Check if this is a Google avatar URL
  if (!googleAvatarUrl || !googleAvatarUrl.includes("googleusercontent.com")) {
    return googleAvatarUrl; // Return original if not a Google avatar
  }

  // Handle different Google avatar URL formats

  // Format 1: Modern Google profile URLs (lh3.googleusercontent.com)
  if (googleAvatarUrl.includes("lh3.googleusercontent.com")) {
    // Remove any existing size parameters (s64, s128, etc.)
    const cleanUrl = googleAvatarUrl.replace(/=s\d+(-c)?/, "");

    // Add full HD parameter (s1080 for 1080p)
    // The '-c' parameter maintains cropping if present in the original
    if (googleAvatarUrl.includes("-c")) {
      return `${cleanUrl}=s1080-c`;
    } else {
      return `${cleanUrl}=s1080`;
    }
  }

  // Format 2: Older Google+ style URLs
  if (googleAvatarUrl.includes("googleusercontent.com/a/")) {
    // These URLs might have a different format
    // First remove any size parameters
    const cleanUrl = googleAvatarUrl.replace(/=s\d+/, "");
    // Add the full HD size parameter
    return `${cleanUrl}=s1080`;
  }

  // If it's a different format or we can't determine how to modify it
  return googleAvatarUrl;
}

async function uploadToCustomS3(
  imageUrl: string,
  key: string,
): Promise<string> {
  const fullHDUrl = getFullHDGoogleAvatar(imageUrl);
  const response = await fetch(fullHDUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch image.");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType =
    response.headers.get("content-type") ?? "application/octet-stream";

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    }),
  );

  const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

  return `https://is3.cloudhost.id/${BUCKET_NAME}/${BUCKET_NAME}/${key}`;
}

export { getFullHDGoogleAvatar, uploadToCustomS3 };
