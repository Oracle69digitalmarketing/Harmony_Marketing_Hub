import { NextRequest, NextResponse } from "next/server";
import { invokeClaude } from "@/lib/bedrock";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Missing prompt" },
        { status: 400 }
      );
    }

    const fullPrompt = `You are an expert marketing copywriter. Generate persuasive, engaging, and high-converting marketing copy based on the following prompt: "${prompt}".`;

    const generatedCopy = await invokeClaude(fullPrompt);

    return NextResponse.json({ copy: generatedCopy });
  } catch (error: any) {
    console.error("Error generating copy:", error);
    return NextResponse.json(
      { message: `An error occurred while communicating with the AI service: ${error.message}` },
      { status: 500 }
    );
  }
}
