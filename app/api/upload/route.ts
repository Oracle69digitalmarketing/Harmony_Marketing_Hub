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
    console.error("Error uploading file to S3:", error);
    // We re-throw the error to be caught by the main handler
    throw new Error("Failed to upload file to S3.");
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    if (!file && !text) {
      return NextResponse.json({ error: "No file or text was provided." }, { status: 400 });
    }

    let fileId: string | null = null;

    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json({ error: "File size exceeds the 10MB limit." }, { status: 413 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      fileId = await uploadFileToS3(buffer, file.name);
    } else if (text) {
      if (text.length > 5000) { // 5000 character limit
        return NextResponse.json({ error: "Text input exceeds the 5000 character limit." }, { status: 413 });
      }
      const buffer = Buffer.from(text, "utf-8");
      fileId = await uploadFileToS3(buffer, "text-input.txt");
    }

    return NextResponse.json({ success: true, fileId });
  } catch (error) {
    let errorMessage = "An unknown error occurred while handling the request.";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes("S3")) {
        statusCode = 502; // Bad Gateway, indicating an issue with an upstream service
      }
    }

    console.error("API Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}