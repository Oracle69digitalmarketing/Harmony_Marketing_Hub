import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function GET(request: NextRequest) {
  try {
    const command = new ScanCommand({
      TableName: "HarmonyMarketingHub-CustomerJourney",
    });

    const { Items } = await docClient.send(command);

    // Sort items by a 'stageOrder' attribute to ensure correct funnel order
    const sortedItems = Items?.sort((a, b) => a.stageOrder - b.stageOrder) || [];

    return NextResponse.json(sortedItems);
  } catch (error) {
    console.error("Error fetching customer journey data:", error);
    // If the table doesn't exist, return an empty array to prevent frontend errors.
    if (error.name === 'ResourceNotFoundException') {
        return NextResponse.json([]);
    }
    return NextResponse.json(
      { message: "Error fetching customer journey data" },
      { status: 500 }
    );
  }
}
