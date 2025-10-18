import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.REGION || "us-east-1";
const TABLE_NAME = process.env.DYNAMO_CAMPAIGNS || "HarmonyCampaigns";

const dynamo = new DynamoDBClient({ region: REGION });
const s3 = new S3Client({ region: REGION });

export const handler = async (event) => {
  console.log("📥 Incoming S3 Event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    // Log details
    console.log(`Processing: ${bucket}/${key}`);

    // Get file (optional: use content for AI processing later)
    const params = { Bucket: bucket, Key: key };
    const file = await s3.send(new GetObjectCommand(params));

    // Store reference metadata in DynamoDB
    const item = {
      CampaignID: { S: key.split(".")[0] },
      CreatedAt: { S: new Date().toISOString() },
      FileName: { S: key },
      Bucket: { S: bucket },
      Status: { S: "Uploaded" },
    };

    await dynamo.send(new PutItemCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    console.log(`✅ Stored ${key} in DynamoDB table ${TABLE_NAME}`);
  }

  return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
};
