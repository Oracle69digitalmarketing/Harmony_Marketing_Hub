import { NextRequest, NextResponse } from "next/server";
import { invokeClaude } from "@/lib/bedrock";

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

    const recommendationsText = await invokeClaude(prompt);
    const recommendations = JSON.parse(recommendationsText);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { message: "Error generating recommendations" },
      { status: 500 }
    );
  }
}
