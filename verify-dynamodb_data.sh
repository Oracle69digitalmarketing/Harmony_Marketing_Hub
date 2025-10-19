#!/bin/bash

REGION="eu-north-1"

echo "=== Verifying Harmony Marketing Hub Tables ==="

for table in ABTests SocialListening CustomerJourney; do
  echo "→ Table: $table"
  aws dynamodb describe-table \
    --table-name HarmonyMarketingHub-$table \
    --region $REGION \
    --query "Table.ItemCount"
done

echo "=== Verification Complete ==="
