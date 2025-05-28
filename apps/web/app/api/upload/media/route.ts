import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { auth } from "@/auth";
import { nanoid } from "@/lib/nanoid";

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

// Handle upload media
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized", data: null },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded", data: null },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = new Date().getTime();
    const extension = file.name.split(".").pop() ?? "jpg";

    const fileName = `media/${session.user.id}/answers/${timestamp}_${nanoid(6)}.${extension}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      }),
    );

    const fileUrl = `${process.env.S3_BUCKET_URL}/forumdiskusi/${fileName}`;

    return NextResponse.json({
      message: "File uploaded successfully",
      data: { url: fileUrl, key: fileName },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Upload failed", error: (error as Error).message },
      { status: 500 },
    );
  }
}

// Handle delete media
export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { message: "No key provided", data: null },
        { status: 400 },
      );
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }),
    );

    return NextResponse.json({
      message: "File deleted successfully",
      data: { key },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error: (error as Error).message },
      { status: 500 },
    );
  }
}
