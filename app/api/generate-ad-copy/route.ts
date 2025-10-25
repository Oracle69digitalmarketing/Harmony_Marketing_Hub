import { NextRequest, NextResponse } from "next/server";
import { invokeClaude } from "@/lib/bedrock";

export async function POST(request: NextRequest) {
  try {
    const { businessPlan } = await request.json();

    if (!businessPlan) {
      return NextResponse.json(
        { message: "Missing business plan" },
        { status: 400 }
      );
    }

    const prompt = `Based on the following business plan, generate ad copy for Google Ads and Facebook Ads. 
    The output must be a single, valid JSON object with two keys: "googleAds" and "facebookAds".
    Each key should contain an object with "headline" and "body" properties.
    Business Plan: ${JSON.stringify(businessPlan)}`;

    const adCopyText = await invokeClaude(prompt);
    const adCopy = JSON.parse(adCopyText);

    return NextResponse.json(adCopy);
  } catch (error: any) {
    console.error("Error generating ad copy:", error);
    return NextResponse.json(
      { message: `An error occurred while communicating with the AI service: ${error.message}` },
      { status: 500 }
    );
  }
}
