import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const command = new GetCommand({
      TableName: "HarmonyMarketingHub-Results",
      Key: {
        id,
      },
    });

    const { Item } = await docClient.send(command);

    if (!Item) {
      return NextResponse.json({ message: "Result not found" }, { status: 404 });
    }

    return NextResponse.json(Item);
  } catch (error) {
    console.error("Error fetching result:", error);
    return NextResponse.json(
      { message: "Error fetching result" },
      { status: 500 }
    );
  }
}
