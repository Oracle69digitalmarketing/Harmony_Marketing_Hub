#!/bin/bash
set -e

REGION="eu-north-1"

echo "=== Seeding A/B Tests ==="
aws dynamodb put-item \
  --table-name HarmonyMarketingHub-ABTests \
  --item '{
    "testId": {"S": "test1"},
    "testName": {"S": "Homepage CTA"},
    "status": {"S": "running"},
    "versionA_visitors": {"N": "1024"},
    "versionA_conversions": {"N": "128"},
    "versionB_visitors": {"N": "1012"},
    "versionB_conversions": {"N": "156"}
  }' \
  --region $REGION

echo "=== Seeding Social Listening ==="
aws dynamodb put-item \
  --table-name HarmonyMarketingHub-SocialListening \
  --item '{
    "keyword": {"S": "BrandX"},
    "last_updated": {"S": "2025-10-19T12:00:00Z"},
    "positive_mentions": {"N": "1200"},
    "negative_mentions": {"N": "300"},
    "neutral_mentions": {"N": "600"},
    "sentiment_trend": {"S": "positive"}
  }' \
  --region $REGION

echo "=== Seeding Customer Journey ==="
aws dynamodb put-item \
  --table-name HarmonyMarketingHub-CustomerJourney \
  --item '{
    "stageOrder": {"N": "1"},
    "stageName": {"S": "Awareness"},
    "userCount": {"N": "10000"}
  }' \
  --region $REGION

echo "=== DynamoDB seeding complete ==="

echo "=== Verifying item counts ==="
aws dynamodb describe-table --table-name HarmonyMarketingHub-ABTests --query 'Table.ItemCount' --region $REGION
aws dynamodb describe-table --table-name HarmonyMarketingHub-SocialListening --query 'Table.ItemCount' --region $REGION
aws dynamodb describe-table --table-name HarmonyMarketingHub-CustomerJourney --query 'Table.ItemCount' --region $REGION
