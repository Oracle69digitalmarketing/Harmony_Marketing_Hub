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

export async function sendEmail(subject: string, body: string, recipient: string) {
  console.log("--- SIMULATING EMAIL ---");
  console.log(`To: ${recipient}`);
  console.log(`Subject: ${subject}`);
  console.log("Body:");
  console.log(body);
  console.log("----------------------");

  // Simulate and store metrics
  const metrics = {
    id: `email-${Date.now()}`,
    channel: 'Email',
    impressions: Math.floor(Math.random() * 10000) + 1000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    conversions: Math.floor(Math.random() * 100) + 10,
    cost: Math.random() * 100 + 50,
    createdAt: new Date().toISOString(),
  };

  const putCommand = new PutCommand({
    TableName: "HarmonyMarketingHub-CampaignMetrics",
    Item: metrics,
  });
  await docClient.send(putCommand);

  return { success: true };
}