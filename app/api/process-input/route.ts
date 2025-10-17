import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";
import { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const textractClient = new TextractClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const rekognitionClient = new RekognitionClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const dynamoClient = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

async function invokeClaude(prompt: string) {
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
    }),
  });

  const { body } = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(body));
  try {
    return JSON.parse(responseBody.content[0].text);
  } catch (e) {
    return responseBody.content[0].text;
  }
}

async function getCoreConcepts(userInput: string) {
  const prompt = `You are a business analyst. Analyze the following user input and identify the core concepts of the business. Return a JSON object with the keys "industry", "targetAudience", and "valueProposition".

User input: "${userInput}"`;
  return await invokeClaude(prompt);
}

async function getMarketingChannelsAndKPIs(coreConcepts: any) {
  const prompt = `You are a marketing strategist. Based on the following core business concepts, recommend the most effective marketing channels and 3-5 key performance indicators (KPIs). Return a JSON object with the keys "marketingChannels" (an array of strings) and "kpis" (an array of strings).

Core concepts: ${JSON.stringify(coreConcepts)}`;
  return await invokeClaude(prompt);
}

async function getExecutiveSummary(coreConcepts: any, marketingPlan: any) {
  const prompt = `You are a business writer. Based on the following core business concepts and marketing plan, write a concise executive summary. Return a JSON object with the key "executiveSummary".

Core concepts: ${JSON.stringify(coreConcepts)}
Marketing plan: ${JSON.stringify(marketingPlan)}`;
  return await invokeClaude(prompt);
}

export async function POST(request: NextRequest) {
  try {
    const { fileId, fileType, text } = await request.json();
    let userInput = text;
    let processedData: string | undefined;

    if (fileId && fileType) {
        const fileName = `${fileId}.${fileType.split("/")[1]}`;

        if (fileType === "application/pdf") {
          const startCommand = new StartDocumentTextDetectionCommand({
            DocumentLocation: {
              S3Object: {
                Bucket: process.env.S3_BUCKET_NAME,
                Name: fileName,
              },
            },
          });
          const { JobId } = await textractClient.send(startCommand);

          if (!JobId) {
            return NextResponse.json(
              { message: "Failed to start Textract job" },
              { status: 500 }
            );
          }

          let jobStatus;
          do {
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
            const getCommand = new GetDocumentTextDetectionCommand({ JobId });
            const { JobStatus, Blocks } = await textractClient.send(getCommand);
            jobStatus = JobStatus;
            if (jobStatus === "SUCCEEDED") {
              processedData = Blocks?.filter(block => block.BlockType === 'LINE').map(block => block.Text).join('\n');
            }
          } while (jobStatus === "IN_PROGRESS");

        } else if (fileType.startsWith("image/")) {
          const command = new DetectLabelsCommand({
            Image: {
              S3Object: {
                Bucket: process.env.S3_BUCKET_NAME,
                Name: fileName,
              },
            },
            MaxLabels: 10,
            MinConfidence: 90,
          });

          const { Labels } = await rekognitionClient.send(command);
          processedData = Labels?.map(label => label.Name).join(', ');

        } else if (fileType.startsWith("video/")) {
          const startCommand = new StartLabelDetectionCommand({
            Video: {
              S3Object: {
                Bucket: process.env.S3_BUCKET_NAME,
                Name: fileName,
              },
            },
          });
          const { JobId } = await rekognitionClient.send(startCommand);

          if (!JobId) {
            return NextResponse.json(
              { message: "Failed to start Rekognition job" },
              { status: 500 }
            );
          }

          let jobStatus;
          do {
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
            const getCommand = new GetLabelDetectionCommand({ JobId });
            const { JobStatus, Labels } = await rekognitionClient.send(getCommand);
            jobStatus = JobStatus;
            if (jobStatus === "SUCCEEDED") {
              processedData = Labels?.map(label => label.Label?.Name).join(', ');
            }
          } while (jobStatus === "IN_PROGRESS");
        }
        userInput = processedData;
    }

    if (!userInput) {
        return NextResponse.json({ message: "No input provided" }, { status: 400 });
    }

    // Agent-like workflow
    const coreConcepts = await getCoreConcepts(userInput);
    const marketingChannelsAndKPIs = await getMarketingChannelsAndKPIs(coreConcepts);
    const executiveSummary = await getExecutiveSummary(coreConcepts, marketingChannelsAndKPIs);

    const fullPlan = {
      ...executiveSummary,
      ...coreConcepts,
      ...marketingChannelsAndKPIs,
    };

    const resultId = uuidv4();
    const putCommand = new PutCommand({
      TableName: "HarmonyMarketingHub-Results",
      Item: {
        id: resultId,
        aiResponse: fullPlan,
        originalText: userInput,
        createdAt: new Date().toISOString(),
        status: 'draft',
      },
    });
    await docClient.send(putCommand);

    return NextResponse.json({
      message: "Processing complete",
      aiResponse: fullPlan,
      resultId,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}