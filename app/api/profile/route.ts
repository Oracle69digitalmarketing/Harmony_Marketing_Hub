
import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    // For now, we'll just log the data. 
    // In a real implementation, you would get the user ID from the session.
    console.log("Updating profile for user:", { name, email });

    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Key: {
        id: "1", // Replace with the actual user ID from session
      },
      UpdateExpression: "set #name = :name, #email = :email",
      ExpressionAttributeNames: {
        "#name": "name",
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":name": name,
        ":email": email,
      },
    });

    await docClient.send(command);

    return NextResponse.json({ success: true, message: "Profile updated successfully." });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 }
    );
  }
}
