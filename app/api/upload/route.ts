import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;
    const fileId = uuidv4();

    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "video/mp4", "video/mov"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { message: "Invalid file type" },
          { status: 400 }
        );
      }

      // Validate file size (e.g., 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { message: "File size exceeds the limit of 10MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = file.name.split(".").pop();
      const fileName = `${fileId}.${fileExtension}`;

      // Upload the file to S3
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        })
      );

      // In a real application, you would trigger the corresponding
      // processing (Textract for PDFs, Rekognition for images/videos) here.
      // For now, we'll just return the file ID.
      return NextResponse.json({
        message: "File uploaded successfully",
        fileId,
      });
    } else if (text) {
      // For text inputs, we can store them directly or trigger a different
      // kind of processing. For now, we'll just return a success message.
      return NextResponse.json({
        message: "Text received",
        fileId, // You might want a different handling for text IDs
      });
    }

    return NextResponse.json(
      { message: "No file or text found" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Error handling request" },
      { status: 500 }
    );
  }
}