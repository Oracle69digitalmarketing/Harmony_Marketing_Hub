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
      TableName: "HarmonyMarketingHub-Compliance",
    });

    const { Items } = await docClient.send(command);

    return NextResponse.json(Items || []);
  } catch (error) {
    console.error("Error fetching compliance data:", error);
    // If the table doesn't exist, return an empty array to prevent frontend errors.
    if (error.name === 'ResourceNotFoundException') {
        return NextResponse.json([]);
    }
    return NextResponse.json(
      { message: "Error fetching compliance data" },
      { status: 500 }
    );
  }
}
