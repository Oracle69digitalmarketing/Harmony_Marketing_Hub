import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Missing prompt" },
        { status: 400 }
      );
    }

    const command = new InvokeModelCommand({
      modelId: "stability.stable-diffusion-xl-v0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 10,
        seed: 0,
        steps: 50,
      }),
    });

    const { body } = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(body));
    
    const imageBase64 = responseBody.artifacts[0].base64;

    return NextResponse.json({ image: imageBase64 });

  } catch (error: any) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { message: `An error occurred while communicating with the AI service: ${error.message}` },
      { status: 500 }
    );
  }
}
