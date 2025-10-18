# IAM Policy for Harmony Marketing Hub

This file contains the necessary IAM policy to run the Harmony Marketing Hub application.

## IAM Policy JSON

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "bedrock:InvokeModel",
            "Resource": "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
        },
        {
            "Effect": "Allow",
            "Action": [
                "textract:StartDocumentTextDetection",
                "textract:GetDocumentTextDetection"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "rekognition:StartLabelDetection",
                "rekognition:GetLabelDetection",
                "rekognition:DetectLabels"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-s3-bucket-name/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:Scan",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:your-aws-region:your-account-id:table/HarmonyMarketingHub-Results",
                "arn:aws:dynamodb:your-aws-region:your-account-id:table/HarmonyMarketingHub-CampaignMetrics"
            ]
        }
    ]
}
```

## How to Use This Policy

1.  **Go to the IAM page** in your AWS console.
2.  **Navigate to "Policies"** on the left-hand menu and click the "Create policy" button.
3.  **Switch to the "JSON" tab** in the policy editor.
4.  **Copy the JSON policy** from this file and paste it into the JSON editor in the AWS console.
5.  **Replace the placeholder values** in the JSON code with your actual values:
    *   `your-s3-bucket-name`: The name of the S3 bucket you are using for this project.
    *   `your-aws-region`: The AWS region where your resources are located (e.g., `us-east-1`).
    *   `your-account-id`: Your 12-digit AWS account ID.
6.  **Review and create the policy**. Give it a descriptive name, like "HarmonyMarketingHubPolicy".
7.  **Attach the policy to your IAM user**. Go to your IAM user's page, click the "Add permissions" button, and attach the "HarmonyMarketingHubPolicy" you just created.

After you've attached this policy to your user, your application will have the necessary permissions to work correctly.
