#!/bin/bash
REGION="eu-north-1"
echo "=== Verifying Harmony Marketing Hub Tables ==="
for table in ABTests SocialListening CustomerJourney; do
  echo "→ $table:"
  aws dynamodb describe-table --table-name HarmonyMarketingHub-$table --query 'Table.ItemCount' --region $REGION
done
