// This API route generates a business plan using AWS Bedrock.
import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize the Bedrock client (using the corrected environment variables)
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

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
  // The response from Claude is a JSON string within the text content, so we parse it twice.
  return JSON.parse(responseBody.content[0].text);
}

export async function POST(request: NextRequest) {
  try {
    const { goal } = await request.json();

    if (!goal) {
      return NextResponse.json(
        { message: "Missing goal text" },
        { status: 400 }
      );
    }

    // Define the prompt for the AI model
    const prompt = `Based on the following business goal, generate a structured business plan. 
    The output must be a single, valid JSON object with the following keys: "executiveSummary", "industry", "targetAudience", "valueProposition", "marketingChannels", "kpis".
    Each key should have a string value, except for "marketingChannels" and "kpis" which should be arrays of strings.
    Do not include any text or formatting outside of the JSON object.

    Business Goal: ${goal}`;

    const generatedPlan = await invokeClaude(prompt);

    return NextResponse.json(generatedPlan);
  } catch (error: any) {
    console.error("Error generating business plan:", error);
    return NextResponse.json(
      { message: "Error generating business plan", error: error.message },
      { status: 500 }
    );
  }
}
