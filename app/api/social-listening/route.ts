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
      TableName: "HarmonyMarketingHub-SocialListening",
    });

    const { Items } = await docClient.send(command);

    return NextResponse.json(Items || []);
  } catch (error) {
    console.error("Error fetching social listening data:", error);
    // If any error occurs, return an empty array to prevent frontend errors.
    return NextResponse.json([]);
  }
}
