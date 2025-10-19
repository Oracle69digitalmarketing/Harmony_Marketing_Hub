import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { message: "Missing text input" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert business consultant specializing in marketing strategy. A user has provided the following text. Your task is to generate a concise, professional business and marketing plan based on this input.

The plan should be well-structured and include the following sections:
1.  **Executive Summary:** A brief, high-level overview of the proposed business and its objectives.
2.  **Target Audience Analysis:** A description of the primary and secondary target demographics.
3.  **Core Marketing Channels:** A list of the most effective marketing channels to reach the target audience (e.g., Social Media, SEO, Content Marketing, Email Marketing).
4.  **Key Performance Indicators (KPIs):** A list of 3-5 measurable KPIs to track the success of the marketing campaigns (e.g., Customer Acquisition Cost, Conversion Rate, Return on Investment).

Here is the user's input:
${text}`;

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
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const { body } = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(body));
    const aiResponse = responseBody.content[0].text;

    const resultId = uuidv4();
    const putCommand = new PutCommand({
      TableName: process.env.DYNAMODB_RESULTS_TABLE,
      Item: {
        id: resultId,
        aiResponse,
        createdAt: new Date().toISOString(),
      },
    });
    await docClient.send(putCommand);

    return NextResponse.json({
      message: "Processing complete",
      aiResponse,
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