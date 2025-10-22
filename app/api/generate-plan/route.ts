import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize AWS clients using IAM roles
const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return NextResponse.json(
        { message: "fileId is required" },
        { status: 400 }
      );
    }

    // Fetch the processed data from DynamoDB
    const getItemCommand = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { fileId: { S: fileId } },
    });
    const { Item } = await dynamoDBClient.send(getItemCommand);

    if (!Item) {
      return NextResponse.json(
        { message: "Processed data not found" },
        { status: 404 }
      );
    }

    const processedData = {
      fileId: Item.fileId.S,
      source: Item.source.S,
      content: JSON.parse(Item.content.S!),
      timestamp: Item.timestamp.S,
    };

    // Develop a detailed prompt for the LLM
    const prompt = `
      Analyze the following data and generate a structured business and marketing plan.
      The output must be a valid JSON object with the following keys: "executiveSummary", "marketAnalysis", "financialPlan", and "marketingCampaigns".

      Data: ${JSON.stringify(processedData.content)}

      JSON Output:
    `;
    const invokeCommand = new InvokeModelCommand({
      modelId: "anthropic.claude-v2",
      contentType: "application/json",
      body: JSON.stringify({
        prompt: `\n\nHuman:${prompt}\n\nAssistant:`,
        max_tokens_to_sample: 4000,
      }),
    });
    const { body } = await bedrockClient.send(invokeCommand);
    const response = JSON.parse(new TextDecoder().decode(body));

    let generatedPlan;
    try {
      generatedPlan = JSON.parse(response.completion);
    } catch (error) {
      console.error("Failed to parse LLM response:", response.completion);
      return NextResponse.json(
        { message: "Failed to generate a valid plan from AI response" },
        { status: 500 }
      );
    }

    // Store the generated plan in DynamoDB
    const putItemCommand = new PutItemCommand({
      TableName: process.env.DYNAMODB_PLANS_TABLE_NAME,
      Item: {
        fileId: { S: fileId },
        plan: { S: JSON.stringify(generatedPlan) },
        createdAt: { S: new Date().toISOString() },
      },
    });
    await dynamoDBClient.send(putItemCommand);

    return NextResponse.json({
      message: "Plan generated and stored successfully",
      plan: generatedPlan,
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Error handling request" },
      { status: 500 }
    );
  }
}