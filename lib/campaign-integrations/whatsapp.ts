import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function sendWhatsAppMessage(message: string, recipient: string) {
  console.log("--- SIMULATING WHATSAPP MESSAGE ---");
  console.log(`To: ${recipient}`);
  console.log(`Message: ${message}`);
  console.log("---------------------------------");

  // Simulate and store metrics
  const metrics = {
    id: `whatsapp-${Date.now()}`,
    channel: 'WhatsApp',
    impressions: Math.floor(Math.random() * 5000) + 500,
    clicks: Math.floor(Math.random() * 500) + 50,
    conversions: Math.floor(Math.random() * 50) + 5,
    cost: Math.random() * 50 + 20,
    createdAt: new Date().toISOString(),
  };

  const putCommand = new PutCommand({
    TableName: "HarmonyMarketingHub-CampaignMetrics",
    Item: metrics,
  });
  await docClient.send(putCommand);

  return { success: true };
}