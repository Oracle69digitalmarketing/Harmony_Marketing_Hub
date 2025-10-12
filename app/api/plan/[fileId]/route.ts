import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

// Initialize AWS client using IAM roles
const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json(
        { message: "fileId is required" },
        { status: 400 }
      );
    }

    const getItemCommand = new GetItemCommand({
      TableName: process.env.DYNAMODB_PLANS_TABLE_NAME,
      Key: { fileId: { S: fileId } },
    });
    const { Item } = await dynamoDBClient.send(getItemCommand);

    if (!Item) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    const plan = JSON.parse(Item.plan.S!);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { message: "Error fetching plan" },
      { status: 500 }
    );
  }
}