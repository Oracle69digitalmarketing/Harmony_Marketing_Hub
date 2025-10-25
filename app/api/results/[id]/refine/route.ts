import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { invokeClaude } from "@/lib/bedrock";

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { refinementInstruction } = await request.json();

    if (!refinementInstruction) {
      return NextResponse.json(
        { message: "Missing refinement instruction" },
        { status: 400 }
      );
    }

    // 1. Get the current plan from DynamoDB
    const getCommand = new GetCommand({
      TableName: process.env.DYNAMODB_RESULTS_TABLE!,
      Key: { id },
    });
    const { Item } = await docClient.send(getCommand);

    if (!Item) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    // 2. Construct the refinement prompt
    const prompt = `You are a business consultant. A user wants to refine a business plan you previously generated.

Current plan:
${JSON.stringify(Item.aiResponse, null, 2)}

User's refinement instruction:
"${refinementInstruction}"

Based on the instruction, refine the plan and return the updated plan as a single JSON object. Do not add any extra text or explanations.`;

    // 3. Get the refined plan from Bedrock
    const refinedPlanText = await invokeClaude(prompt);
    const refinedPlan = JSON.parse(refinedPlanText);

    // 4. Update the plan in DynamoDB
    const updateCommand = new UpdateCommand({
      TableName: process.env.DYNAMODB_RESULTS_TABLE,
      Key: { id },
      UpdateExpression: "set aiResponse = :aiResponse",
      ExpressionAttributeValues: {
        ":aiResponse": refinedPlan,
      },
      ReturnValues: "ALL_NEW",
    });

    const { Attributes } = await docClient.send(updateCommand);

    return NextResponse.json(Attributes);
  } catch (error) {
    console.error("Error refining plan:", error);
    return NextResponse.json(
      { message: "Error refining plan" },
      { status: 500 }
    );
  }
}
