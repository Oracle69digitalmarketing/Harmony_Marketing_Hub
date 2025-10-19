// This API route will handle generating a growth strategy.
import { NextRequest, NextResponse } from "next/server";
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const bedrockAgentClient = new BedrockAgentRuntimeClient({ region: process.env.REGION });

// Replace with your Bedrock Agent ID and Alias ID
const agentId = "YOUR_GROWTH_AGENT_ID";
const agentAliasId = "YOUR_GROWTH_AGENT_ALIAS_ID";

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json();

    if (!idea) {
      return NextResponse.json(
        { message: "Missing business idea" },
        { status: 400 }
      );
    }

    const command = new InvokeAgentCommand({
      agentId,
      agentAliasId,
      sessionId: "some-session-id", // You should generate a unique session ID for each conversation
      inputText: `Generate a growth strategy for the following business idea: "${idea}"`,
    });

    const response = await bedrockAgentClient.send(command);
    
    let growthStrategy = "";
    for await (const chunk of response.completion) {
      if (chunk.chunk?.bytes) {
        growthStrategy += new TextDecoder().decode(chunk.chunk.bytes);
      }
    }

    return NextResponse.json(JSON.parse(growthStrategy));

  } catch (error: any) {
    console.error("Error generating growth strategy:", error);
    return NextResponse.json(
      { message: `An error occurred while generating the growth strategy: ${error.message}` },
      { status: 500 }
    );
  }
}
