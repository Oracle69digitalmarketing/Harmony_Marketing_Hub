const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { TextractClient, AnalyzeDocumentCommand } = require("@aws-sdk/client-textract");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const s3Client = new S3Client({});
const textractClient = new TextractClient({});
const dynamoDBClient = new DynamoDBClient({});

exports.handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  try {
    // 1. Get the PDF from S3
    const { Body } = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

    // 2. Analyze the document with Textract
    const analyzeDocCommand = new AnalyzeDocumentCommand({
      Document: { Bytes: Body },
      FeatureTypes: ["FORMS"],
    });
    const { Blocks } = await textractClient.send(analyzeDocCommand);

    // 3. Extract key-value pairs
    const keyValuePairs = Blocks
      .filter(block => block.BlockType === "KEY_VALUE_SET" && block.EntityTypes.includes("KEY"))
      .map(keyBlock => {
        const valueBlock = keyBlock.Relationships.find(rel => rel.Type === "VALUE").Ids.map(id => Blocks.find(b => b.Id === id)).map(vb => vb.Relationships.find(rel => rel.Type === "CHILD").Ids.map(childId => Blocks.find(b => b.Id === childId).Text).join(" ")).join(" ");
        return { [keyBlock.Relationships.find(rel => rel.Type === "CHILD").Ids.map(id => Blocks.find(b => b.Id === id).Text).join(" ")]: valueBlock };
      });

    // 4. Normalize and store the results in DynamoDB
    const fileId = key.split(".")[0];
    const { normalizeTextractOutput } = require("/var/task/lib/normalization.js");
    const normalizedData = normalizeTextractOutput(fileId, keyValuePairs);

    const putItemCommand = new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        fileId: { S: normalizedData.fileId },
        source: { S: normalizedData.source },
        content: { S: JSON.stringify(normalizedData.content) },
        timestamp: { S: normalizedData.timestamp },
      },
    });
    await dynamoDBClient.send(putItemCommand);

    console.log(`Successfully processed ${key} and stored results in DynamoDB.`);
  } catch (error) {
    console.error(`Error processing ${key}:`, error);
    throw error;
  }
};