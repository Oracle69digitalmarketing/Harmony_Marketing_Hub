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
      TableName: "HarmonyMarketingHub-Notifications",
    });

    const { Items } = await docClient.send(command);

    // Sort items by timestamp, newest first. Assumes a 'timestamp' attribute.
    const sortedItems = Items?.sort((a, b) => b.timestamp - a.timestamp) || [];

    return NextResponse.json(sortedItems);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Error fetching notifications" },
      { status: 500 }
    );
  }
}
