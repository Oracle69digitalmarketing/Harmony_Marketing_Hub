import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { invokeClaude } from "@/lib/bedrock";

const s3Client = new S3Client({});
const textractClient = new TextractClient({});
const rekognitionClient = new RekognitionClient({});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, fileType, text } = body;

    let prompt;

    if (text) {
      console.log("Processing text input.");
      prompt = `Based on the following text, generate a business plan: ${text}`;
    } else if (fileId && fileType) {
      console.log(`Processing file with ID: ${fileId} and type: ${fileType}`);
      const bucketName = process.env.S3_BUCKET_NAME;

      if (!bucketName) {
        throw new Error("S3_BUCKET_NAME environment variable is not set.");
      }

      let analysisResult;

      if (fileType.startsWith("image/")) {
        const command = new DetectLabelsCommand({
          Image: {
            S3Object: {
              Bucket: bucketName,
              Name: fileId,
            },
          },
        });
        analysisResult = await rekognitionClient.send(command);
        console.log("Rekognition analysis:", analysisResult);
        prompt = `Based on the following image labels, generate a business plan: ${JSON.stringify(analysisResult.Labels)}`;
      } else if (
        fileType === "application/pdf" ||
        fileType === "application/msword" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const command = new AnalyzeDocumentCommand({
          Document: {
            S3Object: {
              Bucket: bucketName,
              Name: fileId,
            },
          },
          FeatureTypes: ["FORMS", "TABLES"],
        });
        analysisResult = await textractClient.send(command);
        console.log("Textract analysis:", analysisResult);
        prompt = `Based on the following document analysis, generate a business plan: ${JSON.stringify(analysisResult.Blocks)}`;
      } else {
        console.log(`Unsupported file type: ${fileType}`);
        return NextResponse.json({ success: true, message: "File type not supported for analysis." });
      }
    } else {
      throw new Error("Invalid request body. Must contain either 'text' or 'fileId' and 'fileType'.");
    }

    const aiResponseText = await invokeClaude(prompt);
    const aiResponse = JSON.parse(aiResponseText);

    return NextResponse.json({ success: true, message: "Processing completed.", aiResponse });

  } catch (error) {
    console.error("Error in process-input:", error);
    return NextResponse.json(
      { message: "Error processing input", error: error.message },
      { status: 500 }
    );
  }
}
