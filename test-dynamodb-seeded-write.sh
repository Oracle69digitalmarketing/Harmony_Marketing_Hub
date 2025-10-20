#!/bin/bash
REGION="eu-central-1"
PREFIX="HarmonyMarketingHub"

echo "=== Testing Realistic DynamoDB Write Capability (Seeded Data) ==="

# ABTests
TABLE_NAME="$PREFIX-ABTests"
TEST_ID="ABT-$(date +%s)-$RANDOM"
aws dynamodb put-item --table-name "$TABLE_NAME" --region "$REGION" --item "{
  \"TestID\": {\"S\": \"$TEST_ID\"},
  \"CampaignName\": {\"S\": \"Homepage CTA Variant\"},
  \"VariantA_CTR\": {\"N\": \"0.42\"},
  \"VariantB_CTR\": {\"N\": \"0.55\"},
  \"Winner\": {\"S\": \"Variant B\"},
  \"CreatedAt\": {\"S\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}
}" > /dev/null 2>&1
RESULT=$(aws dynamodb get-item --table-name "$TABLE_NAME" --region "$REGION" --key "{\"TestID\": {\"S\": \"$TEST_ID\"}}" --query 'Item.Winner.S' --output text 2>/dev/null)
[[ "$RESULT" == "Variant B" ]] && echo "✅ ABTests Write Success ($TEST_ID)" || echo "❌ ABTests Write Failed"

# SocialListening
TABLE_NAME="$PREFIX-SocialListening"
POST_ID="SOC-$(date +%s)-$RANDOM"
aws dynamodb put-item --table-name "$TABLE_NAME" --region "$REGION" --item "{
  \"PostID\": {\"S\": \"$POST_ID\"},
  \"Keyword\": {\"S\": \"BrandX\"},
  \"Sentiment\": {\"S\": \"Positive\"},
  \"Mentions\": {\"N\": \"1200\"},
  \"Platform\": {\"S\": \"Twitter\"},
  \"Date\": {\"S\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}
}" > /dev/null 2>&1
RESULT=$(aws dynamodb get-item --table-name "$TABLE_NAME" --region "$REGION" --key "{\"PostID\": {\"S\": \"$POST_ID\"}}" --query 'Item.Sentiment.S' --output text 2>/dev/null)
[[ "$RESULT" == "Positive" ]] && echo "✅ SocialListening Write Success ($POST_ID)" || echo "❌ SocialListening Write Failed"

# CustomerJourney
TABLE_NAME="$PREFIX-CustomerJourney"
JOURNEY_ID="CJN-$(date +%s)-$RANDOM"
aws dynamodb put-item --table-name "$TABLE_NAME" --region "$REGION" --item "{
  \"JourneyID\": {\"S\": \"$JOURNEY_ID\"},
  \"Stage\": {\"S\": \"Consideration\"},
  \"UserCount\": {\"N\": \"2500\"},
  \"AvgDuration\": {\"N\": \"34\"},
  \"ConversionRate\": {\"N\": \"0.18\"},
  \"Timestamp\": {\"S\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}
}" > /dev/null 2>&1
RESULT=$(aws dynamodb get-item --table-name "$TABLE_NAME" --region "$REGION" --key "{\"JourneyID\": {\"S\": \"$JOURNEY_ID\"}}" --query 'Item.Stage.S' --output text 2>/dev/null)
[[ "$RESULT" == "Consideration" ]] && echo "✅ CustomerJourney Write Success ($JOURNEY_ID)" || echo "❌ CustomerJourney Write Failed"

echo "=== Write Verification Complete ==="
