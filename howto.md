# How to Implement Real Campaign Execution in Harmony Marketing Hub

This guide explains how to replace the placeholder `executeCampaign` function in `lambda/campaign-manager.ts` with real implementations to send marketing campaigns through various channels.

## Prerequisites

Before you begin, ensure you have the following:

-   An AWS account with administrator access.
-   The AWS CLI configured on your local machine.
-   The Amplify project for Harmony Marketing Hub set up and deployed.
-   Necessary IAM permissions for SES, and any other AWS services you plan to use.

## 1. Email Campaigns with AWS Simple Email Service (SES)

AWS SES is a cost-effective and scalable email service. Here's how to integrate it into your campaign manager.

### Step 1.1: Verify Your Sender Identity in SES

Before you can send emails, you need to prove that you own the "From" email address.

1.  Go to the **AWS SES console**.
2.  In the navigation pane, under **Configuration**, choose **Verified identities**.
3.  Choose **Create identity**.
4.  Select **Email address** or **Domain**, and follow the on-screen instructions. You will receive a verification email. Click the link in the email to complete the verification.

### Step 1.2: Update the `campaign-manager.ts` for SES

Now, you'll modify the `executeCampaign` function to use the AWS SDK for SES.

First, install the SES client if it's not already in your `package.json`:
```bash
pnpm add @aws-sdk/client-ses
```

Then, update `lambda/campaign-manager.ts` like this:

```typescript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// ... (keep the MarketingPlan interface)

export const executeCampaign = async (plan: MarketingPlan): Promise<{ success: boolean; message: string }> => {
  console.log("--- Starting Campaign Execution ---");
  // ... (keep the initial console logs)

  for (const channel of plan.marketingChannels) {
    console.log(`Executing campaign on channel: ${channel}`);
    switch (channel.toLowerCase()) {
      case "email":
        console.log("  -> Sending marketing emails via SES...");
        const sesClient = new SESClient({ region: process.env.AWS_REGION });
        const emailParams = {
          Source: "your-verified-email@example.com", // Replace with your verified SES email
          Destination: {
            // In a real app, you would get this from your user database
            ToAddresses: ["customer1@example.com", "customer2@example.com"],
          },
          Message: {
            Subject: { Data: plan.executiveSummary || "A Special Offer" },
            Body: {
              Text: { Data: plan.valueProposition || "Check out our new product!" },
            },
          },
        };
        try {
          await sesClient.send(new SendEmailCommand(emailParams));
          console.log("    -> Email sent successfully via SES.");
        } catch (error) {
          console.error("    -> Error sending email:", error);
        }
        break;
      // ... (other cases)
    }
  }
  // ... (keep the final console logs and return statement)
};
```

**Note on Credentials:** The code uses `process.env.AWS_REGION`. Amplify automatically makes the region available as an environment variable in the build environment. The AWS SDK will automatically use the IAM role associated with the Lambda function, so you don't need to manage access keys and secret keys manually.

## 2. WhatsApp Campaigns with Twilio (External API)

AWS does not have a native service for sending WhatsApp messages. For this, you'll need to use a third-party service like **Twilio**.

### Step 2.1: Set up a Twilio Account

1.  Go to the [Twilio website](https://www.twilio.com/) and sign up for a free trial account.
2.  Follow their instructions to get a Twilio phone number and your **Account SID** and **Auth Token**.
3.  Configure the Twilio Sandbox for WhatsApp to test your integration.

### Step 2.2: Store Twilio Credentials Securely

**Do not hardcode your credentials!** Use Amplify's environment variables to store them securely.

1.  In your Amplify project, run the following commands:
    ```bash
    amplify add function # Choose "Lambda function" and give it a name like "secrets"
    ```
2.  When prompted, choose to store secrets. Add your Twilio credentials:
    -   `TWILIO_ACCOUNT_SID`
    -   `TWILIO_AUTH_TOKEN`
    -   `TWILIO_PHONE_NUMBER`
3.  Amplify will store these in AWS Secrets Manager and make them available as environment variables to your Lambda functions.

Alternatively, you can add them directly as environment variables in the Amplify Console under **Environment variables**.

### Step 2.3: Update the `campaign-manager.ts` for Twilio

First, install the Twilio SDK:
```bash
pnpm add twilio
```

Then, update the `whatsapp` case in `lambda/campaign-manager.ts`:

```typescript
import { Twilio } from "twilio";

// ... (inside the executeCampaign function)

      case "whatsapp":
        console.log("  -> Sending WhatsApp messages via Twilio...");
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
        const client = new Twilio(accountSid, authToken);

        try {
          await client.messages.create({
            body: plan.valueProposition || "Check out our new product!",
            from: `whatsapp:${twilioPhoneNumber}`,
            to: "whatsapp:+1234567890", // Replace with a real phone number
          });
          console.log("    -> WhatsApp message sent successfully via Twilio.");
        } catch (error) {
          console.error("    -> Error sending WhatsApp message:", error);
        }
        break;
```

## 3. Setting up 'Wow Features'

To enable the A/B Testing, Social Listening, and Customer Journey Funnel features, you need to create the corresponding DynamoDB tables and add some sample data. Here are the AWS CLI commands to do so.

### 3.1. A/B Testing

**Create the table:**
```bash
aws dynamodb create-table \
    --table-name HarmonyMarketingHub-ABTests \
    --attribute-definitions \
        AttributeName=testId,AttributeType=S \
    --key-schema \
        AttributeName=testId,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5
```

**Add sample data:**
```bash
aws dynamodb put-item \
    --table-name HarmonyMarketingHub-ABTests \
    --item 
```json
{
        "testId": {"S": "test1"},
        "testName": {"S": "New Homepage CTA"},
        "status": {"S": "running"},
        "versionA_visitors": {"N": "1024"},
        "versionA_conversions": {"N": "128"},
        "versionB_visitors": {"N": "1012"},
        "versionB_conversions": {"N": "156"}
    }
```

```bash
aws dynamodb put-item \
    --table-name HarmonyMarketingHub-ABTests \
    --item 
```json
{
        "testId": {"S": "test2"},
        "testName": {"S": "Pricing Page Layout"},
        "status": {"S": "completed"},
        "versionA_visitors": {"N": "2048"},
        "versionA_conversions": {"N": "256"},
        "versionB_visitors": {"N": "2012"},
        "versionB_conversions": {"N": "312"}
    }
```

### 3.2. Social Listening

**Create the table:**
```bash
aws dynamodb create-table \
    --table-name HarmonyMarketingHub-SocialListening \
    --attribute-definitions \
        AttributeName=keyword,AttributeType=S \
    --key-schema \
        AttributeName=keyword,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5
```

**Add sample data:**
```bash
aws dynamodb put-item \
    --table-name HarmonyMarketingHub-SocialListening \
    --item 
```json
{
        "keyword": {"S": "BrandX"},
        "last_updated": {"S": "2025-10-19T12:00:00Z"},
        "positive_mentions": {"N": "1200"},
        "negative_mentions": {"N": "300"},
        "neutral_mentions": {"N": "600"},
        "sentiment_trend": {"S": "positive"}
    }
```

```bash
aws dynamodb put-item \
    --table-name HarmonyMarketingHub-SocialListening \
    --item 
```json
{
        "keyword": {"S": "ProductY"},
        "last_updated": {"S": "2025-10-19T12:00:00Z"},
        "positive_mentions": {"N": "50"},
        "negative_mentions": {"N": "80"},
        "neutral_mentions": {"N": "120"},
        "sentiment_trend": {"S": "negative"}
    }
```

### 3.3. Customer Journey Funnel

**Create the table:**
```bash
aws dynamodb create-table \
    --table-name HarmonyMarketingHub-CustomerJourney \
    --attribute-definitions \
        AttributeName=stageOrder,AttributeType=N \
    --key-schema \
        AttributeName=stageOrder,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5
```

**Add sample data:**
```bash
aws dynamodb put-item \
    --table-name HarmonyMarketingHub-CustomerJourney \
    --item 
```json
{
        "stageOrder": {"N": "1"},
        "stageName": {"S": "Awareness"},
        "userCount": {"N": "10000"}
    }
```

```bash
aws dynamodb put-item \
    --table-name HarmonyMarketingHub-CustomerJourney \
    --item 
```json
{
        "stageOrder": {"N": "2"},
        "stageName": {"S": "Consideration"},
        "userCount": {"N": "2500"}
    }
```

```bash
aws dynamodb put-item \
    --table-name HarmonyMarketingHub-CustomerJourney \
    --item 
```json
{
        "stageOrder": {"N": "3"},
        "stageName": {"S": "Conversion"},
        "userCount": {"N": "500"}
    }
```

```bash
aws dynamodb put-item \
    --table-name HarmonyMarketingHub-CustomerJourney \
    --item 
```json
{
        "stageOrder": {"N": "4"},
        "stageName": {"S": "Loyalty"},
        "userCount": {"N": "200"}
    }
```

## Final Code Example

Here's what your `lambda/campaign-manager.ts` might look like with the SES and Twilio examples integrated:

```typescript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Twilio } from "twilio";

interface MarketingPlan {
  executiveSummary: string;
  industry: string;
  targetAudience: string;
  valueProposition: string;
  marketingChannels: string[];
  kpis: string[];
}

export const executeCampaign = async (plan: MarketingPlan): Promise<{ success: boolean; message: string }> => {
  console.log("--- Starting Campaign Execution ---");
  console.log(`Campaign for: ${plan.executiveSummary}`);
  console.log(`Target Audience: ${plan.targetAudience}`);

  if (!plan.marketingChannels || plan.marketingChannels.length === 0) {
    console.warn("No marketing channels specified in the plan.");
    return { success: false, message: "No marketing channels to execute." };
  }

  for (const channel of plan.marketingChannels) {
    console.log(`Executing campaign on channel: ${channel}`);
    switch (channel.toLowerCase()) {
      case "email":
        console.log("  -> Sending marketing emails via SES...");
        const sesClient = new SESClient({ region: process.env.AWS_REGION });
        const emailParams = {
          Source: "your-verified-email@example.com",
          Destination: {
            ToAddresses: ["customer1@example.com"],
          },
          Message: {
            Subject: { Data: plan.executiveSummary || "A Special Offer" },
            Body: {
              Text: { Data: plan.valueProposition || "Check out our new product!" },
            },
          },
        };
        try {
          await sesClient.send(new SendEmailCommand(emailParams));
          console.log("    -> Email sent successfully via SES.");
        } catch (error) {
          console.error("    -> Error sending email:", error);
        }
        break;

      case "whatsapp":
        console.log("  -> Sending WhatsApp messages via Twilio...");
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
        const client = new Twilio(accountSid, authToken);

        try {
          await client.messages.create({
            body: plan.valueProposition || "Check out our new product!",
            from: `whatsapp:${twilioPhoneNumber}`,
            to: "whatsapp:+1234567890",
          });
          console.log("    -> WhatsApp message sent successfully via Twilio.");
        } catch (error) {
          console.error("    -> Error sending WhatsApp message:", error);
        }
        break;

      case "social media":
        console.log("  -> Posting on social media (not implemented)...");
        // Add your social media integration here
        break;

      default:
        console.log(`  -> Unknown channel: ${channel}`);
        break;
    }
  }

  console.log("--- Campaign Execution Finished ---");
  return { success: true, message: "Campaign execution simulated successfully." };
};
```