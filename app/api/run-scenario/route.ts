import { NextRequest, NextResponse } from "next/server";
import { invokeClaude } from "@/lib/bedrock";

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
    const prompt = `Based on a total budget of ${budget}, a timeframe of ${timeframe} months, and a '${riskLevel}' risk level, generate scenario data for a marketing campaign.
    The output must be a single, valid JSON object with the following keys: "executiveSummary", "industry", "targetAudience", "valueProposition", "marketingChannels", "kpis", "scenarioData", "channelAllocation", "aiRecommendations", "expectedRoi", "projectedLeads", "costPerLead".

    "executiveSummary" should be a string summarizing the plan.
    "industry" should be a string identifying the industry.
    "targetAudience" should be a string describing the target audience.
    "valueProposition" should be a string explaining the value proposition.
    "marketingChannels" should be an array of strings, each representing a marketing channel.
    "kpis" should be an array of strings, each representing a key performance indicator.

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

    const generatedDataText = await invokeClaude(prompt);
    const generatedData = JSON.parse(generatedDataText);

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