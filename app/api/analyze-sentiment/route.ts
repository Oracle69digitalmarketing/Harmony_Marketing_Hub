import { NextRequest, NextResponse } from "next/server";
import { ComprehendClient, DetectSentimentCommand } from "@aws-sdk/client-comprehend";

const comprehendClient = new ComprehendClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { message: "Missing text input" },
        { status: 400 }
      );
    }

    const command = new DetectSentimentCommand({
      Text: text,
      LanguageCode: "en",
    });

    const { Sentiment, SentimentScore } = await comprehendClient.send(command);

    return NextResponse.json({
      Sentiment,
      SentimentScore,
    });
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return NextResponse.json(
      { message: "Error analyzing sentiment" },
      { status: 500 }
    );
  }
}