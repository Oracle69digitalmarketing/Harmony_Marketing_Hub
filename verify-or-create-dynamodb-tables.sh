#!/bin/bash

REGION="eu-north-1"
PREFIX="HarmonyMarketingHub"

echo "=== Harmony Marketing Hub DynamoDB Table Verification ==="

# Table definitions (add more as needed)
declare -A TABLE_SCHEMAS=(
  ["ABTests"]="AttributeName=TestID,KeyType=HASH"
  ["SocialListening"]="AttributeName=PostID,KeyType=HASH"
  ["CustomerJourney"]="AttributeName=JourneyID,KeyType=HASH"
)

for table in "${!TABLE_SCHEMAS[@]}"; do
  TABLE_NAME="$PREFIX-$table"
  echo "→ Checking table: $TABLE_NAME"

  # Check if table exists
  if aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$REGION" > /dev/null 2>&1; then
    STATUS=$(aws dynamodb describe-table --table-name "$TABLE_NAME" \
      --region "$REGION" --query 'Table.TableStatus' --output text)
    echo "   ✅ Exists (Status: $STATUS)"
  else
    echo "   ⚠️  Table not found — creating $TABLE_NAME..."
    aws dynamodb create-table \
      --table-name "$TABLE_NAME" \
      --attribute-definitions AttributeName=$(echo "${TABLE_SCHEMAS[$table]}" | cut -d= -f2 | cut -d, -f1),AttributeType=S \
      --key-schema ${TABLE_SCHEMAS[$table]} \
      --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
      --region "$REGION"

    echo "   🛠️  Creating... waiting for ACTIVE status"
    aws dynamodb wait table-exists --table-name "$TABLE_NAME" --region "$REGION"
    echo "   ✅ $TABLE_NAME created successfully."
  fi
done

echo "=== Verification Complete ==="
