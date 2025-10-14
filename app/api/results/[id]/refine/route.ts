import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function invokeClaude(prompt: string) {
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2000, // Increased token limit for refinement
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
    }),
  });

  const { body } = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(body));
  try {
    return JSON.parse(responseBody.content[0].text);
  } catch (e) {
    return responseBody.content[0].text;
  }
}

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
      TableName: "HarmonyMarketingHub-Results",
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
    const refinedPlan = await invokeClaude(prompt);

    // 4. Update the plan in DynamoDB
    const updateCommand = new UpdateCommand({
      TableName: "HarmonyMarketingHub-Results",
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
