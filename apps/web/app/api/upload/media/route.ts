import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { auth } from "@/auth";
import { nanoid } from "@/lib/nanoid";
import { prisma } from "@/lib/prisma";

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

/*
LOGIC:
- isUsed = false → temporary (belum digunakan dalam answer final)
- isUsed = true  → permanent (sudah digunakan dalam answer final)

FLOW:
1. Upload: isUsed = false, sessionId = user_session
2. Submit: isUsed = true, answerId = new_answer_id
3. Cleanup: delete where isUsed = false AND createdAt < threshold
*/

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    const url = `${process.env.S3_BUCKET_URL}/${process.env.S3_BUCKET_NAME}/${fileName}`;
    const key = fileName;

    // save ke database untuk tracking file

    await prisma.image.create({
      data: {
        key,
        url,
        isUsed: false,
        createdBy: session.user.id,
        type: "ATTACHMENT",
      },
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      data: { url, key },
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
