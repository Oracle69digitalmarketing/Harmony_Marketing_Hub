import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({});

export async function invokeClaude(prompt: string) {
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
    }),
  });

  try {
    const { body } = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(body));
    return responseBody.content[0].text;
  } catch (error) {
    console.error("Error invoking Claude:", error);
    throw new Error("Error invoking Claude.");
  }
}