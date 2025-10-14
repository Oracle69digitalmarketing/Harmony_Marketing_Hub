# Project Setup Guide: Building a Reusable AWS Environment for AI Applications

This guide provides a step-by-step process for setting up a robust and reusable AWS environment for your AI-powered applications. By using Infrastructure as Code (IaC) with the AWS Cloud Development Kit (CDK), you can easily create, manage, and replicate your cloud infrastructure.

---

## Part 1: AWS Account and CLI Setup

### 1.1. Create an AWS Account

If you don't already have one, sign up for a free AWS account at [aws.amazon.com](https://aws.amazon.com/).

### 1.2. Create an IAM User for Development

For security, it's a best practice not to use your root account for development. Instead, create an IAM (Identity and Access Management) user with administrative permissions.

1.  Go to the **IAM console** in your AWS account.
2.  Click on **"Users"** and then **"Add users"**.
3.  Enter a user name (e.g., `admin-dev`).
4.  Select **"Provide user access to the AWS Management Console"**.
5.  Select **"I want to create an IAM user"**.
6.  Set a custom password.
7.  On the next page, select **"Attach policies directly"** and attach the `AdministratorAccess` policy. **Note:** For a production environment, you would create a role with more restrictive, least-privilege permissions.
8.  Complete the user creation process.

### 1.3. Install and Configure the AWS CLI

The AWS Command Line Interface (CLI) is a powerful tool for interacting with AWS services.

1.  **Install the AWS CLI:** Follow the instructions for your operating system in the [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).
2.  **Create Access Keys:**
    *   Go back to the IAM console and select the user you just created.
    *   Go to the **"Security credentials"** tab.
    *   In the **"Access keys"** section, click **"Create access key"**.
    *   Select **"Command Line Interface (CLI)"** as the use case.
    *   Download the `.csv` file with the `Access key ID` and `Secret access key`. **Store these securely.**
3.  **Configure the AWS CLI:**
    *   Open your terminal and run the following command:
        ```bash
        aws configure --profile my-dev-profile
        ```
        (You can replace `my-dev-profile` with any name you like for your profile).
    *   Enter the `Access key ID` and `Secret access key` you just downloaded.
    *   Set a default region (e.g., `us-east-1`).
    *   Set a default output format (e.g., `json`).

You can now run AWS commands using this profile, for example: `aws s3 ls --profile my-dev-profile`.

---

## Part 2: Setting Up Core Services with AWS CDK

We will use the AWS CDK to define our infrastructure as code. This will allow us to easily create and manage our AWS resources.

### 2.1. Initialize a CDK Project

1.  **Install the AWS CDK:**
    ```bash
    npm install -g aws-cdk
    ```
2.  **Create a new directory for your infrastructure code:**
    ```bash
    mkdir infrastructure
    cd infrastructure
    ```
3.  **Initialize a new CDK project (using TypeScript):**
    ```bash
    cdk init app --language typescript
    ```

### 2.2. Define Your Infrastructure Stack

Open the `lib/infrastructure-stack.ts` file and replace the content with the following code. This code will define an S3 bucket, two DynamoDB tables, an IAM role, and a Lambda function.

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. S3 Bucket for file uploads
    const fileUploadBucket = new s3.Bucket(this, 'FileUploadBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
      autoDeleteObjects: true, // NOT for production
    });

    // 2. DynamoDB Tables
    const resultsTable = new dynamodb.Table(this, 'ResultsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
    });

    const metricsTable = new dynamodb.Table(this, 'MetricsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
    });

    // 3. IAM Role for Lambda functions
    const lambdaRole = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // Grant permissions to the role
    fileUploadBucket.grantReadWrite(lambdaRole);
    resultsTable.grantReadWriteData(lambdaRole);
    metricsTable.grantReadWriteData(lambdaRole);
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel', 'textract:*', 'rekognition:*'],
      resources: ['*'], // For production, restrict this to specific resources
    }));

    // 4. Campaign Manager Lambda Function
    const campaignManagerLambda = new NodejsFunction(this, 'CampaignManagerLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: '../lambda/campaign-manager/index.ts', // Path to your Lambda code
      role: lambdaRole,
      environment: {
        RESULTS_TABLE_NAME: resultsTable.tableName,
        METRICS_TABLE_NAME: metricsTable.tableName,
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'FileUploadBucketName', { value: fileUploadBucket.bucketName });
    new cdk.CfnOutput(this, 'ResultsTableName', { value: resultsTable.tableName });
    new cdk.CfnOutput(this, 'MetricsTableName', { value: metricsTable.tableName });
  }
}
```

### 2.3. Deploy the CDK Stack

1.  **Bootstrap your environment (only needs to be done once per region):**
    ```bash
    cdk bootstrap --profile my-dev-profile
    ```
2.  **Deploy the stack:**
    ```bash
    cdk deploy --profile my-dev-profile
    ```
    The CDK will show you the resources that will be created and ask for your confirmation.

After the deployment is complete, you will see the names of the created S3 bucket and DynamoDB tables in the output.

---

## Part 3: Connecting Your Application

Now that your AWS resources are created, you can connect your Next.js application to them.

1.  **Set up your environment variables:**
    In your `.env.local` file, use the output values from the CDK deployment:
    ```
    AWS_REGION=your-aws-region
    AWS_ACCESS_KEY_ID=your-aws-access-key-id
    AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
    S3_BUCKET_NAME=<value-from-cdk-output>
    # The table names are now passed as environment variables to the Lambdas
    # You can also add them here if your API routes need them directly
    ```
2.  **Use the AWS SDK:**
    Your application code can now use the AWS SDK to interact with the services. The IAM role you created will be automatically assumed by the Lambda functions, so you don't need to hardcode credentials in your Lambda code. For local development, the SDK will use the credentials from your configured AWS CLI profile.

---

## Conclusion

By following this guide, you have created a reusable and scalable AWS environment for your AI applications. Using Infrastructure as Code with the AWS CDK allows you to easily manage, version, and replicate your infrastructure, which is a best practice for modern cloud development.
