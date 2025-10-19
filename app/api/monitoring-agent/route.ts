import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });

const docClient = DynamoDBDocumentClient.from(dynamoClient);

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

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

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json({ message: "Missing planId" }, { status: 400 });
    }

    // 1. Fetch metrics from DynamoDB
    const metricsCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_CAMPAIGNMETRICS_TABLE,
    });
    const { Items: metrics } = await docClient.send(metricsCommand);

    if (!metrics || metrics.length === 0) {
      return NextResponse.json({ message: "No metrics found" }, { status: 404 });
    }

    // 2. Ask the LLM to analyze the metrics
    const prompt = `You are a marketing monitoring agent. Your task is to analyze the following campaign metrics and decide if the marketing plan needs to be refined.

Campaign Metrics:
${JSON.stringify(metrics, null, 2)}

Based on these metrics, does the plan need refinement? If yes, provide a concise instruction for what to refine. Return a JSON object with two keys: "refinementNeeded" (boolean) and "refinementInstruction" (a string, which is empty if no refinement is needed).`;

    const analysis = await invokeClaude(prompt);

    if (analysis.refinementNeeded) {
      // 3. If refinement is needed, trigger the refine endpoint
      const refineResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/results/${planId}/refine`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refinementInstruction: analysis.refinementInstruction }),
        }
      );

      if (!refineResponse.ok) {
        throw new Error('Failed to trigger refinement');
      }

      const refinedData = await refineResponse.json();
      return NextResponse.json({
        message: "Refinement triggered successfully",
        analysis,
        refinedPlan: refinedData,
      });
    }

    return NextResponse.json({
      message: "No refinement needed at this time",
      analysis,
    });
  } catch (error) {
    console.error("Error in monitoring agent:", error);
    return NextResponse.json(
      { message: "Error in monitoring agent" },
      { status: 500 }
    );
  }
}