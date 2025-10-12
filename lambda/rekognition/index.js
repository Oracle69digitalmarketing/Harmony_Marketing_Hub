const { S3Client } = require("@aws-sdk/client-s3");
const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const s3Client = new S3Client({});
const rekognitionClient = new RekognitionClient({});
const dynamoDBClient = new DynamoDBClient({});

exports.handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  try {
    // 1. Analyze the image with Rekognition
    const detectLabelsCommand = new DetectLabelsCommand({
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: key,
        },
      },
      MaxLabels: parseInt(process.env.REKOGNITION_MAX_LABELS || '10', 10),
      MinConfidence: parseFloat(process.env.REKOGNITION_MIN_CONFIDENCE || '75'),
    });
    const { Labels } = await rekognitionClient.send(detectLabelsCommand);

    // 2. Normalize and store the results in DynamoDB
    const fileId = key.split(".")[0];
    const { normalizeRekognitionOutput } = require("/var/task/lib/normalization.js");
    const normalizedData = normalizeRekognitionOutput(fileId, Labels);

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

    console.log(`Successfully processed ${key} with Rekognition and stored results in DynamoDB.`);
  } catch (error) {
    console.error(`Error processing ${key} with Rekognition:`, error);
    throw error;
  }
};