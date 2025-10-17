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
    // In a real app with many tests, you would use Query with an index.
    // For this prototype, Scan is acceptable.
    const command = new ScanCommand({
      TableName: "HarmonyMarketingHub-ABTests",
    });

    const { Items } = await docClient.send(command);

    return NextResponse.json(Items || []);
  } catch (error) {
    console.error("Error fetching A/B tests:", error);
    // If the table doesn't exist, return an empty array to prevent frontend errors.
    if (error.name === 'ResourceNotFoundException') {
        return NextResponse.json([]);
    }
    return NextResponse.json(
      { message: "Error fetching A/B tests" },
      { status: 500 }
    );
  }
}
