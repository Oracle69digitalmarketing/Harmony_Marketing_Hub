import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

async function invokeClaude(prompt: string) {
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
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
  return responseBody.content[0].text;
}

export async function POST(request: NextRequest) {
  try {
    const { metrics } = await request.json();

    if (!metrics) {
      return NextResponse.json(
        { message: "Missing metrics data" },
        { status: 400 }
      );
    }

    const prompt = `You are a marketing analyst. Based on the following campaign metrics, provide a few actionable recommendations for improvement. Return a JSON object with the key "recommendations" which is an array of strings.

Campaign Metrics:
${JSON.stringify(metrics, null, 2)}`;

    const recommendations = await invokeClaude(prompt);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { message: "Error generating recommendations" },
      { status: 500 }
    );
  }
}