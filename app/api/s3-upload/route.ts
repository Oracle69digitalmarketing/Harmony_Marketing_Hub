
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({ region: process.env.REGION });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "No file found in request" }, { status: 400 });
    }

    const fileId = uuidv4();
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
        throw new Error("S3_BUCKET_NAME environment variable is not set.");
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileId,
      Body: file as any,
    });

    await s3Client.send(command);

    return NextResponse.json({ success: true, fileId: fileId });

  } catch (error) {
    console.error("Error in S3 upload:", error);
    return NextResponse.json(
      { message: "Error processing upload" },
      { status: 500 }
    );
  }
}
