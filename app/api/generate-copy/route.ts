// This API route generates marketing copy using AWS Bedrock.
import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize the Bedrock client
const bedrockClient = new BedrockRuntimeClient({ region: process.env.REGION });

// Helper function to invoke the Claude model
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
  return responseBody.content[0].text;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Missing prompt" },
        { status: 400 }
      );
    }

    const fullPrompt = `You are an expert marketing copywriter. Generate persuasive, engaging, and high-converting marketing copy based on the following prompt: "${prompt}".`;

    const generatedCopy = await invokeClaude(fullPrompt);

    return NextResponse.json({ copy: generatedCopy });
  } catch (error: any) {
    console.error("Error generating copy:", error);
    return NextResponse.json(
      { message: `An error occurred while communicating with the AI service: ${error.message}` },
      { status: 500 }
    );
  }
}
