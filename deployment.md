# AWS Deployment Plan for Harmony Marketing Hub

This document provides a detailed guide on how to deploy the Harmony Marketing Hub application to AWS.

## Introduction

There are several ways to deploy a Next.js application to AWS. We will cover two popular options:

1.  **AWS Amplify:** A fully managed service from AWS that simplifies the deployment and hosting of web applications. This is the recommended option for this project as it provides seamless integration with other AWS services.
2.  **Vercel:** The creators of Next.js provide a platform that is highly optimized for deploying Next.js applications. It's known for its ease of use and fast deployments.

## Prerequisites

Before you deploy the application, make sure you have the following:

*   An AWS account.
*   A GitHub, GitLab, or Bitbucket account with your project's code pushed to a repository.
*   The AWS CLI installed and configured on your local machine (optional, but recommended).

## Deployment Option 1: AWS Amplify (Recommended)

### Step 1: Connect Your Repository to Amplify

1.  Sign in to the AWS Management Console and open the **AWS Amplify** console.
2.  Click on **"New app"** and then **"Host web app"**.
3.  Select your Git provider (GitHub, GitLab, etc.) and authorize Amplify to access your repositories.
4.  Choose the repository for the Harmony Marketing Hub project and the branch you want to deploy (e.g., `main`).
5.  Click **"Next"**.

### Step 2: Configure Build Settings

Amplify will automatically detect that you are deploying a Next.js application and will provide a default build configuration. You should not need to change this.

### Step 3: Configure Environment Variables

This is a critical step. You need to provide the application with the necessary environment variables to connect to the AWS services.

1.  In the Amplify console, go to **"Environment variables"**.
2.  Add the following environment variables:
    *   `AWS_REGION`: The AWS region where you have created your other resources (e.g., `eu-north-1`).
    *   `AWS_ACCESS_KEY_ID`: The access key for an IAM user with the necessary permissions.
    *   `AWS_SECRET_ACCESS_KEY`: The secret access key for the IAM user.
    *   `S3_BUCKET_NAME`: The name of the S3 bucket you will use for file uploads.

**Security Note:** It is highly recommended to use an IAM role with the minimum required permissions instead of creating a user with long-lived credentials. You can configure this in the "Service role" section in Amplify.

### Step 4: Review and Deploy

1.  Review your settings and click **"Save and deploy"**.
2.  Amplify will now build and deploy your application. You can monitor the progress in the Amplify console.
3.  Once the deployment is complete, you will get a URL for your live application.

## Deployment Option 2: Vercel

### Step 1: Import Your Project to Vercel

1.  Sign up for a Vercel account and connect it to your Git provider.
2.  From the Vercel dashboard, click on **"Add New..."** and then **"Project"**.
3.  Select the repository for the Harmony Marketing Hub project.
4.  Vercel will automatically detect that it's a Next.js project and configure the build settings.

### Step 2: Configure Environment Variables

1.  In the project settings in Vercel, go to the **"Environment Variables"** section.
2.  Add the same environment variables as listed in the Amplify section above.

### Step 3: Deploy

1.  Click the **"Deploy"** button.
2.  Vercel will build and deploy your application, providing you with a live URL.

## Post-Deployment Steps

After you have deployed the application, you need to configure the AWS resources that it depends on.

### 1. Create DynamoDB Tables

You need to create two DynamoDB tables in your AWS account:

*   **Table name:** `HarmonyMarketingHub-Results`
    *   **Primary key:** `id` (String)
*   **Table name:** `HarmonyMarketingHub-CampaignMetrics`
    *   **Primary key:** `id` (String)

### 2. Create S3 Bucket

Create an S3 bucket in your AWS account. The name of this bucket should match the `S3_BUCKET_NAME` environment variable you configured during deployment. You will also need to configure the CORS settings for the bucket to allow your application to upload files to it.

### 3. (Optional) Set up DynamoDB Stream for Campaign Execution

In our current implementation, the campaign execution is simulated with a direct call in the "approve" endpoint. For a more robust, event-driven architecture, you should use a DynamoDB Stream to trigger the Campaign Manager Lambda.

1.  **Enable DynamoDB Stream:**
    *   In the DynamoDB console, select the `HarmonyMarketingHub-Results` table.
    *   Go to the "Exports and streams" tab and turn on DynamoDB Streams.
    *   Select "New and old images" as the view type.
2.  **Deploy the Campaign Manager Lambda:**
    *   The code for the Lambda is in the `lambda/campaign-manager` directory. You will need to deploy this function to AWS Lambda.
3.  **Connect the Stream to the Lambda:**
    *   In the Lambda console, add a trigger to your `campaign-manager` function.
    *   Select "DynamoDB" as the trigger source and choose the `HarmonyMarketingHub-Results` table.

By following this guide, you will be able to successfully deploy the Harmony Marketing Hub application to AWS.
