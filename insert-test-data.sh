#!/bin/bash

REGION="eu-central-1"

echo "=== Inserting Test Data into Harmony Marketing Hub Tables ==="

# ABTests
aws dynamodb put-item \
  --table-name HarmonyMarketingHub-ABTests \
  --region $REGION \
  --item '{
    "testId": {"S": "test-001"},
    "variantA": {"S": "Landing Page A"},
    "variantB": {"S": "Landing Page B"},
    "winner": {"S": "Pending"}
  }'

# SocialListening
aws dynamodb put-item \
  --table-name HarmonyMarketingHub-SocialListening \
  --region $REGION \
  --item '{
    "keyword": {"S": "BrandX"},
    "sentiment": {"S": "Positive"},
    "mentions": {"N": "50"}
  }'

# CustomerJourney
aws dynamodb put-item \
  --table-name HarmonyMarketingHub-CustomerJourney \
  --region $REGION \
  --item '{
    "stageOrder": {"N": "1"},
    "stageName": {"S": "Awareness"},
    "userCount": {"N": "1200"}
  }'

echo "=== Data Inserted Successfully ==="
