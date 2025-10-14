import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { executeCampaign } from "../../../../lambda/campaign-manager";

const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const command = new UpdateCommand({
      TableName: "HarmonyMarketingHub-Results",
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
        TableName: "HarmonyMarketingHub-Results",
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