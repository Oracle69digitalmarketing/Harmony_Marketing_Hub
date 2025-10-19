#!/bin/bash
set -e

echo "=== Setting up Harmony Marketing Hub DynamoDB tables ==="

/home/sophiemabel78/Harmony_Marketing_Hub/aws/dist/aws dynamodb create-table \
  --table-name harmonyhub-users \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=email,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --global-secondary-indexes '[{"IndexName": "email-index", "KeySchema": [{"AttributeName": "email", "KeyType": "HASH"}], "Projection": {"ProjectionType": "ALL"}, "ProvisionedThroughput": {"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}}]' || true

/home/sophiemabel78/Harmony_Marketing_Hub/aws/dist/aws dynamodb create-table \
  --table-name HarmonyMarketingHub-ABTests \
  --attribute-definitions AttributeName=testId,AttributeType=S \
  --key-schema AttributeName=testId,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 || true

/home/sophiemabel78/Harmony_Marketing_Hub/aws/dist/aws dynamodb create-table \
  --table-name HarmonyMarketingHub-SocialListening \
  --attribute-definitions AttributeName=keyword,AttributeType=S \
  --key-schema AttributeName=keyword,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 || true

/home/sophiemabel78/Harmony_Marketing_Hub/aws/dist/aws dynamodb create-table \
  --table-name HarmonyMarketingHub-CustomerJourney \
  --attribute-definitions AttributeName=stageOrder,AttributeType=N \
  --key-schema AttributeName=stageOrder,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 || true

echo "=== Tables created successfully ==="
