// This API route will handle competitor analysis.
import { NextRequest, NextResponse } from "next/server";
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const bedrockAgentClient = new BedrockAgentRuntimeClient({ region: process.env.REGION });

// Replace with your Bedrock Agent ID and Alias ID
const agentId = "YOUR_COMPETITOR_AGENT_ID";
const agentAliasId = "YOUR_COMPETITOR_AGENT_ALIAS_ID";

export async function POST(request: NextRequest) {
  try {
    const { website } = await request.json();

    if (!website) {
      return NextResponse.json(
        { message: "Missing website" },
        { status: 400 }
      );
    }

    const command = new InvokeAgentCommand({
      agentId,
      agentAliasId,
      sessionId: "some-session-id", // You should generate a unique session ID for each conversation
      inputText: `Analyze the competitor website: ${website}`,
    });

    const response = await bedrockAgentClient.send(command);
    
    let competitorData = "";
    for await (const chunk of response.completion) {
      if (chunk.chunk?.bytes) {
        competitorData += new TextDecoder().decode(chunk.chunk.bytes);
      }
    }

    return NextResponse.json(JSON.parse(competitorData));

  } catch (error: any) {
    console.error("Error analyzing competitor:", error);
    return NextResponse.json(
      { message: `An error occurred while analyzing the competitor: ${error.message}` },
      { status: 500 }
    );
  }
}
