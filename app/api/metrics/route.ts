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
      TableName: "HarmonyMarketingHub-CampaignMetrics",
    });

    const { Items } = await docClient.send(command);

    return NextResponse.json(Items);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { message: "Error fetching metrics" },
      { status: 500 }
    );
  }
}