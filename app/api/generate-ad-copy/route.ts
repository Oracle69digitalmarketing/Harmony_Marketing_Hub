import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

async function invokeClaude(prompt: string) {
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2000,
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
  return JSON.parse(responseBody.content[0].text);
}

export async function POST(request: NextRequest) {
  try {
    const { businessPlan } = await request.json();

    if (!businessPlan) {
      return NextResponse.json(
        { message: "Missing business plan" },
        { status: 400 }
      );
    }

    const prompt = `Based on the following business plan, generate ad copy for Google Ads and Facebook Ads. 
    The output must be a single, valid JSON object with two keys: "googleAds" and "facebookAds".
    Each key should contain an object with "headline" and "body" properties.
    Business Plan: ${JSON.stringify(businessPlan)}`;

    const adCopy = await invokeClaude(prompt);

    return NextResponse.json(adCopy);
  } catch (error: any) {
    console.error("Error generating ad copy:", error);
    return NextResponse.json(
      { message: `An error occurred while communicating with the AI service: ${error.message}` },
      { status: 500 }
    );
  }
}
