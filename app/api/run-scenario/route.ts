// This API route generates scenario data using AWS Bedrock.
import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize the Bedrock client (using the corrected environment variables)
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

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
    const { budget, timeframe, riskLevel } = await request.json();

    if (!budget || !timeframe || !riskLevel) {
      return NextResponse.json(
        { message: "Missing budget, timeframe, or risk level" },
        { status: 400 }
      );
    }

    // Define the prompt for the AI model
    const prompt = `Based on a total budget of $${budget}, a timeframe of ${timeframe} months, and a '${riskLevel}' risk level, generate scenario data for a marketing campaign.
    The output must be a single, valid JSON object with the following keys: "scenarioData", "channelAllocation", "aiRecommendations", "expectedRoi", "projectedLeads", "costPerLead".

    "scenarioData" should be an array of 6 objects, each with the following properties:
    - "month": (string) The month of the scenario (e.g., "Jan", "Feb", "Mar").
    - "conservative": (number) The projected revenue for a conservative scenario.
    - "moderate": (number) The projected revenue for a moderate scenario.
    - "aggressive": (number) The projected revenue for an aggressive scenario.

    "channelAllocation" should be an array of 5 objects, each with the following properties:
    - "channel": (string) The name of the marketing channel (e.g., "Google Ads", "Facebook").
    - "current": (number) The current allocation percentage for the channel.
    - "optimized": (number) The AI-recommended optimized allocation percentage for the channel.

    "aiRecommendations" should be an array of 3 strings, each representing a recommendation.

    "expectedRoi" should be a number representing the expected ROI.

    "projectedLeads" should be a number representing the projected leads.

    "costPerLead" should be a number representing the cost per lead.

    Do not include any text or formatting outside of the JSON object.`;

    const generatedData = await invokeClaude(prompt);

    return NextResponse.json(generatedData);
  } catch (error: any) {
    console.error("Error generating scenario data:", error);
    // Return the specific error message from the AWS SDK
    return NextResponse.json(
      { message: `An error occurred while communicating with the AI service: ${error.message}` },
      { status: 500 }
    );
  }
}