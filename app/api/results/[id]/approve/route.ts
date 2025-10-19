import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { executeCampaign } from "@/lambda/campaign-manager";

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });

const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_RESULTS_TABLE,
      Key: {
        id,
      },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "approved",
      },
    });

    await docClient.send(command);

    // Simulate the campaign execution trigger
    const getCommand = new GetCommand({
        TableName: process.env.DYNAMODB_RESULTS_TABLE,
        Key: { id },
    });
    const { Item } = await docClient.send(getCommand);

    if (Item) {
        await executeCampaign(Item.aiResponse);
    }

    return NextResponse.json({ message: "Plan approved and campaign execution simulated" });
  } catch (error) {
    console.error("Error approving plan:", error);
    return NextResponse.json(
      { message: "Error approving plan" },
      { status: 500 }
    );
  }
}