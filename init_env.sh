cd ~/harmony_marketing_hub
nano init_env.sh       # paste script
chmod +x init_env.sh
./init_env.sh
cd ~/harmony_marketing_hub
nano init_env.sh       # paste script
chmod +x init_env.sh
./init_env.sh#!/bin/bash
# ======================================================
# 🧠 Harmony Marketing Hub - AWS Environment Bootstrapper
# Region: eu-central-1
# Project: Harmony Marketing Hub (Oracle69)
# ======================================================

echo "🔧 Initializing AWS + App environment..."

# Core AWS and Project Config
export AWS_REGION="eu-central-1"
export DYNAMO_TABLE="HarmonyHubUsers"
export API_GATEWAY_URL="https://elzmx42bq8.execute-api.eu-central-1.amazonaws.com/prod"
export BEDROCK_MODEL_ID="anthropic.claude-3-haiku"

# Optional Amplify App Context
export APP_ID="d2xqe9qe371d51"
export APP_URL="d2xqe9qe371d51.amplifyapp.com"
export AMPLIFY_ENV="production"
export AMPLIFY_SERVICE_ROLE="AmplifyServiceRole-HarmonyMarketingHub"

# Agents (Bedrock)
export REACT_APP_BEDROCK_AGENT_GROWTH="3AIZNPULT4"
export REACT_APP_BEDROCK_AGENT_COMPETITOR="YJW2SSY6FS"
export REACT_APP_BEDROCK_AGENT_SOCIAL="JC4WZAOTJ6"

# S3 or App data (optional)
export REACT_APP_S3_BUCKET="harmony-marketing-hub-eu-central"

# Confirm setup
echo "✅ AWS Region: $AWS_REGION"
echo "✅ DynamoDB Table: $DYNAMO_TABLE"
echo "✅ API Gateway: $API_GATEWAY_URL"
echo "✅ Bedrock Model: $BEDROCK_MODEL_ID"
echo "✅ Amplify App ID: $APP_ID"
echo "✅ Amplify URL: https://main.$APP_URL"
echo "🌍 Environment loaded successfully."
