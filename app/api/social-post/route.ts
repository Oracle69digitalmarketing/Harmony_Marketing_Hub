// This API route will handle posting to social media.
import { NextRequest, NextResponse } from "next/server";
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const bedrockAgentClient = new BedrockAgentRuntimeClient({ region: process.env.REGION });

// Replace with your Bedrock Agent ID and Alias ID
const agentId = "YOUR_AGENT_ID";
const agentAliasId = "YOUR_AGENT_ALIAS_ID";

export async function POST(request: NextRequest) {
  try {
    const { postContent, selectedAccounts } = await request.json();

    if (!postContent || !selectedAccounts || selectedAccounts.length === 0) {
      return NextResponse.json(
        { message: "Missing post content or selected accounts" },
        { status: 400 }
      );
    }

    const promises = selectedAccounts.map((platform: string) => {
      const command = new InvokeAgentCommand({
        agentId,
        agentAliasId,
        sessionId: "some-session-id", // You should generate a unique session ID for each conversation
        inputText: `Post the following content to ${platform}: "${postContent}"`,
      });
      return bedrockAgentClient.send(command);
    });

    await Promise.all(promises);

    return NextResponse.json({ success: true, message: "Posted successfully." });

  } catch (error: any) {
    console.error("Error posting to social media:", error);
    return NextResponse.json(
      { message: `An error occurred while posting to social media: ${error.message}` },
      { status: 500 }
    );
  }
}
