# Check your current Amplify app configuration
aws amplify get-app --app-id $APP_ID --region eu-central-1 --query 'app.iamServiceRoleArn'
# List available IAM roles
aws iam list-roles --query 'Roles[?contains(RoleName, `amplify`) || contains(RoleName, `Amplify`)].{RoleName:RoleName,Arn:Arn}' --output table
# Get your account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
# Create Amplify service role trust policy
cat > amplify-trust-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "amplify.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

# Create the IAM role
aws iam create-role     --role-name AmplifyServiceRole-HarmonyMarketingHub     --assume-role-policy-document file://amplify-trust-policy.json     --description "Service role for Amplify Harmony Marketing Hub"
# Attach the Amplify backend deployment policy
aws iam attach-role-policy     --role-name AmplifyServiceRole-HarmonyMarketingHub     --policy-arn arn:aws:iam::aws:policy/AdministratorAccess-Amplify
echo "✅ Amplify service role created"
# Create custom Amplify policy
cat > amplify-custom-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "amplify:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "lambda:CreateFunction",
                "lambda:DeleteFunction",
                "lambda:GetFunction",
                "lambda:GetFunctionConfiguration",
                "lambda:UpdateFunctionCode",
                "lambda:UpdateFunctionConfiguration",
                "lambda:ListFunctions",
                "lambda:InvokeFunction",
                "lambda:AddPermission",
                "lambda:RemovePermission",
                "lambda:GetPolicy"
            ],
            "Resource": [
                "arn:aws:lambda:eu-central-1:$ACCOUNT_ID:function:*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateRole",
                "iam:DeleteRole",
                "iam:GetRole",
                "iam:PassRole",
                "iam:AttachRolePolicy",
                "iam:DetachRolePolicy",
                "iam:PutRolePolicy",
                "iam:DeleteRolePolicy"
            ],
            "Resource": [
                "arn:aws:iam::$ACCOUNT_ID:role/amplify-*",
                "arn:aws:iam::$ACCOUNT_ID:role/LambdaExecutionRole*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:*",
                "cognito-identity:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:CreateBucket",
                "s3:DeleteBucket",
                "s3:GetBucketLocation",
                "s3:ListBucket",
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:GetBucketPolicy",
                "s3:PutBucketPolicy"
            ],
            "Resource": [
                "arn:aws:s3:::amplify-*",
                "arn:aws:s3:::amplify-*/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:CreateTable",
                "dynamodb:DeleteTable",
                "dynamodb:DescribeTable",
                "dynamodb:UpdateTable",
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:eu-central-1:$ACCOUNT_ID:table/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "apigateway:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:CreateStack",
                "cloudformation:DeleteStack",
                "cloudformation:DescribeStacks",
                "cloudformation:UpdateStack",
                "cloudformation:DescribeStackEvents",
                "cloudformation:DescribeStackResources",
                "cloudformation:GetTemplate"
            ],
            "Resource": [
                "arn:aws:cloudformation:eu-central-1:$ACCOUNT_ID:stack/amplify-*"
            ]
        }
    ]
}
EOF

# Create and attach the custom policy
aws iam create-policy     --policy-name AmplifyCustomPolicy-HarmonyMarketingHub     --policy-document file://amplify-custom-policy.json     --description "Custom policy for Amplify Harmony Marketing Hub"
aws iam attach-role-policy     --role-name AmplifyServiceRole-HarmonyMarketingHub     --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/AmplifyCustomPolicy-HarmonyMarketingHub
echo "✅ Custom Amplify policy created and attached"
# Update your Amplify app with the new service role
aws amplify update-app     --app-id $APP_ID     --iam-service-role-arn arn:aws:iam::$ACCOUNT_ID:role/AmplifyServiceRole-HarmonyMarketingHub     --region eu-central-1
echo "✅ Amplify app updated with new service role"
# Create optimized amplify.yml
cat > amplify.yml << 'EOF'
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci --cache .npm --prefer-offline
        build:
          commands:
            - echo "Building React app for Harmony Marketing Hub"
            - npm run build
      artifacts:
        baseDirectory: build
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .npm/**/*
    appRoot: /
backend:
  phases:
    build:
      commands:
        - echo "Backend build phase"
        - echo "Configuring AWS resources for eu-central-1"
environment:
  variables:
    # React App Environment Variables
    REACT_APP_AWS_REGION: eu-central-1
    REACT_APP_BEDROCK_AGENT_GROWTH: 3AIZNPULT4
    REACT_APP_BEDROCK_AGENT_COMPETITOR: YJW2SSY6FS
    REACT_APP_BEDROCK_AGENT_SOCIAL: JC4WZAOTJ6
    
    # Backend Configuration
    AWS_DEFAULT_REGION: eu-central-1
    
    # DynamoDB Tables
    REACT_APP_DYNAMODB_CUSTOMER_TABLE: CustomerData
    REACT_APP_DYNAMODB_COMPETITOR_TABLE: CompetitorData
    REACT_APP_DYNAMODB_PERFORMANCE_TABLE: PerformanceMetrics
    
    # S3 Configuration
    REACT_APP_S3_BUCKET: harmony-marketing-hub-eu-central
    
    # Lambda Functions
    REACT_APP_LAMBDA_FILE_PROCESSOR: HarmonyFileProcessor
EOF

# Update build settings
aws amplify update-app     --app-id $APP_ID     --build-spec file://amplify.yml     --region eu-central-1
echo "✅ Build specification updated"
# Set environment variables for the app
aws amplify update-branch     --app-id $APP_ID     --branch-name main     --environment-variables '{
        "REACT_APP_AWS_REGION": "eu-central-1",
        "REACT_APP_BEDROCK_AGENT_GROWTH": "3AIZNPULT4",
        "REACT_APP_BEDROCK_AGENT_COMPETITOR": "YJW2SSY6FS",
        "REACT_APP_BEDROCK_AGENT_SOCIAL": "JC4WZAOTJ6",
        "AWS_DEFAULT_REGION": "eu-central-1"
    }'     --region eu-central-1
echo "✅ Environment variables set"
export APP_ID="d2xqe9qe371d51"
echo $APP_ID
# Should output: d2xqe9qe371d51
aws amplify get-app --app-id $APP_ID --region eu-central-1 --query 'app.{Name:name,Status:platform,Domain:defaultDomain}'
# Ensure APP_ID is set
export APP_ID="d2xqe9qe371d51"
# Only run if APP_ID is valid
if [ ! -z "$APP_ID" ] && [ "$APP_ID" != "None" ]; then     echo "Updating existing Amplify app: $APP_ID"; 
    aws amplify update-app         --app-id $APP_ID         --iam-service-role-arn arn:aws:iam::114501972554:role/AmplifyServiceRole-HarmonyMarketingHub         --region eu-central-1;      echo "✅ App IAM role updated successfully"; 
    aws amplify update-app         --app-id $APP_ID         --build-spec file://amplify.yml         --region eu-central-1;      echo "✅ Build spec updated"; 
    aws amplify start-job         --app-id $APP_ID         --branch-name main         --job-type RELEASE         --region eu-central-1;      echo "✅ Deployment started"; else     echo "❌ APP_ID not set or invalid. Please set APP_ID first."; fi
#!/bin/bash
# ===============================
# Harmony Marketing Hub - Amplify Deployment Script
# ===============================
# --- Step 0: Set your AWS account and APP_ID ---
export APP_ID="d2xqe9qe371d51"
export AWS_REGION="eu-central-1"
# Verify APP_ID
if [ -z "$APP_ID" ] || [ "$APP_ID" = "None" ]; then     echo "❌ APP_ID is not set. Please set it before running this script.";     exit 1; fi
echo "✅ Using Amplify APP_ID: $APP_ID"
# --- Step 1: Set environment variables for the main branch ---
ENV_VARS=$(cat <<EOF
{
  "REACT_APP_AWS_REGION": "eu-central-1",
  "REACT_APP_BEDROCK_AGENT_GROWTH": "3AIZNPULT4",
  "REACT_APP_BEDROCK_AGENT_COMPETITOR": "YJW2SSY6FS",
  "REACT_APP_BEDROCK_AGENT_SOCIAL": "JC4WZAOTJ6",
  "AWS_DEFAULT_REGION": "eu-central-1",
  "REACT_APP_S3_BUCKET": "harmony-marketing-hub-eu-central"
}
EOF

)
echo "🔧 Updating branch environment variables..."
aws amplify update-branch     --app-id $APP_ID     --branch-name main     --environment-variables "$ENV_VARS"     --region $AWS_REGION
echo "✅ Environment variables set"
# --- Step 2: Generate amplify.yml build spec ---
cat > amplify.yml << 'EOF'
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - echo "Building Harmony Marketing Hub for eu-central-1"
            - npm run build
      artifacts:
        baseDirectory: build
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
    appRoot: /
environment:
  variables:
    REACT_APP_AWS_REGION: eu-central-1
    REACT_APP_BEDROCK_AGENT_GROWTH: 3AIZNPULT4
    REACT_APP_BEDROCK_AGENT_COMPETITOR: YJW2SSY6FS
    REACT_APP_BEDROCK_AGENT_SOCIAL: JC4WZAOTJ6
EOF

echo "🔧 Updating Amplify build spec..."
aws amplify update-app     --app-id $APP_ID     --build-spec file://amplify.yml     --region $AWS_REGION
echo "✅ Build specification updated"
# --- Step 3: Trigger a new deployment ---
echo "🚀 Starting new deployment..."
aws amplify start-job     --app-id $APP_ID     --branch-name main     --job-type RELEASE     --region $AWS_REGION
echo "✅ Deployment triggered. Check Amplify console for status."
#!/bin/bash
# ===============================
# Save Harmony Marketing Hub Amplify Configuration
# ===============================
# Ensure APP_ID and APP_URL are set
if [ -z "$APP_ID" ] || [ -z "$APP_URL" ]; then     echo "❌ APP_ID or APP_URL is not set. Please set them before running this.";     exit 1; fi
