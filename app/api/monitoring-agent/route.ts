import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { invokeClaude } from "@/lib/bedrock";

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

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

    const analysisText = await invokeClaude(prompt);
    const analysis = JSON.parse(analysisText);

    if (analysis.refinementNeeded) {
      // 3. If refinement is needed, trigger the refine endpoint
      const refineResponse = await fetch(
        `/api/results/${planId}/refine`,
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