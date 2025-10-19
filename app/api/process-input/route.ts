
import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const textractClient = new TextractClient({ region: process.env.AWS_REGION });
const rekognitionClient = new RekognitionClient({ region: process.env.AWS_REGION });
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, fileType } = body;

    console.log(`Processing file with ID: ${fileId} and type: ${fileType}`);

    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
        throw new Error("S3_BUCKET_NAME environment variable is not set.");
    }

    let analysisResult;
    let prompt;

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
      // For now, just return a success message for unsupported types
      return NextResponse.json({ success: true, message: "File type not supported for analysis." });
    }

    const bedrockCommand = new InvokeModelCommand({
        modelId: "anthropic.claude-v2",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({ 
            prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
            max_tokens_to_sample: 3000,
        }),
    });

    const bedrockResponse = await bedrockClient.send(bedrockCommand);
    const bedrockResponseDecoded = new TextDecoder().decode(bedrockResponse.body);
    const bedrockResponseBody = JSON.parse(bedrockResponseDecoded);

    return NextResponse.json({ success: true, message: "File processing completed.", data: bedrockResponseBody.completion });

  } catch (error) {
    console.error("Error in process-input:", error);
    return NextResponse.json(
      { message: "Error processing input" },
      { status: 500 }
    );
  }
}
