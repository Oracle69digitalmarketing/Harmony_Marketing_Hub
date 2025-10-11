import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadFileToS3(file: Buffer, fileName: string) {
  const fileBuffer = file;
  const fileId = `${Date.now()}-${fileName}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileId,
    Body: fileBuffer,
    ContentType: "application/octet-stream",
  };

  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
    console.log("File uploaded successfully:", fileId);
    return fileId;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    if (!file && !text) {
      return NextResponse.json({ error: "No file uploaded or text provided." }, { status: 400 });
    }

    let fileId: string | null = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      fileId = await uploadFileToS3(buffer, file.name);
    } else if (text) {
      // If there's only text, create a file from it and upload to S3
      const buffer = Buffer.from(text, "utf-8");
      fileId = await uploadFileToS3(buffer, "text-input.txt");
    }

    return NextResponse.json({ success: true, fileId });
  } catch (error) {
    return NextResponse.json({ error: "Error handling the request." }, { status: 500 });
  }
}