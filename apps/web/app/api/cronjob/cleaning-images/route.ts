import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { s3 } from "@/lib/s3";
import { prisma } from "@/lib/prisma";

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const API_KEY = process.env.API_KEY;
const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

async function deleteImage(image: { key: string; imageId: string }) {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: image.key,
      }),
    );
  } catch (err) {
    console.error(`Failed to delete S3 object: ${image.key}`, err);
  }
  try {
    await prisma.image.delete({
      where: { imageId: image.imageId },
    });
  } catch (err) {
    console.error(`Failed to delete DB image: ${image.imageId}`, err);
  }
}

export async function GET(request: NextRequest) {
  const apiKey = request.nextUrl.searchParams.get("apiKey");
  if (!apiKey || apiKey !== API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [temporaryImage, orphanedImageAttachments, orphanedImageAvatars] =
      await Promise.all([
        prisma.image.findMany({
          where: {
            isUsed: false,
            createdAt: { lt: oneDayAgo },
          },
          select: { key: true, imageId: true },
        }),
        prisma.image.findMany({
          where: {
            type: "ATTACHMENT",
            isUsed: true,
            answerId: null,
          },
          select: { key: true, imageId: true },
        }),
        prisma.image.findMany({
          where: {
            type: "AVATAR",
            isUsed: true,
            userId: null,
          },
          select: { key: true, imageId: true },
        }),
      ]);

    const imagesToDelete = [
      ...temporaryImage,
      ...orphanedImageAttachments,
      ...orphanedImageAvatars,
    ];

    const results = await Promise.allSettled(
      imagesToDelete.map((image) => deleteImage(image)),
    );

    const deletedCount = results.filter((r) => r.status === "fulfilled").length;
    const failedCount = results.length - deletedCount;

    return NextResponse.json({
      message: "Proses pembersihan selesai!",
      deletedCount,
      failedCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Proses pembersihan gagal!",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
