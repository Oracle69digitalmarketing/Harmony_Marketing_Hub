
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email } = await request.json();

    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Key: {
        id: session.user.id,
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
