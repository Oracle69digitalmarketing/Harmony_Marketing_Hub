# Harmony Marketing Hub - Architecture

This document outlines the architecture of the Harmony Marketing Hub application.

## High-Level Overview

The application is a serverless web application built on Next.js and hosted on AWS. It uses a variety of AWS services to provide an end-to-end solution for generating, executing, and monitoring AI-powered marketing plans.

## Architecture Diagram (Mermaid.js)

```mermaid
graph TD
    subgraph User Interface
        A[Next.js Frontend on Amplify/Vercel]
    end

    subgraph API Layer (Next.js API Routes)
        B[/api/upload]
        C[/api/process-input]
        D[/api/results/{id}]
        E[/api/results/{id}/approve]
        F[/api/results/{id}/refine]
        G[/api/metrics]
        H[/api/recommendations]
        I[/api/monitoring-agent]
    end

    subgraph AWS Services
        J[Amazon S3]
        K[Amazon DynamoDB]
        L[Amazon Bedrock]
        M[Amazon Textract]
        N[Amazon Rekognition]
        O[AWS Lambda]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G
    A --> H
    A --> I

    B --> J
    C --> J
    C --> M
    C --> N
    C --> L
    C --> K

    D --> K
    E --> K
    E --> O

    F --> K
    F --> L

    G --> K
    H --> L
    I --> K
    I --> L
    I --> F

    O --> J
    O --> K
```

## Components

### 1. Frontend

*   **Framework:** Next.js (React)
*   **Hosting:** AWS Amplify or Vercel
*   **Description:** A modern, responsive user interface that allows users to input data, view generated plans, approve and refine them, and monitor campaign performance.

### 2. Backend (API Layer)

*   **Framework:** Next.js API Routes
*   **Description:** A set of serverless functions that handle the application's business logic.

### 3. AWS Services

*   **Amazon S3:** Used for storing user-uploaded files (images, PDFs, videos).
*   **Amazon DynamoDB:**
    *   `HarmonyMarketingHub-Results`: Stores the generated business plans, their status (`draft`, `approved`), and other metadata.
    *   `HarmonyMarketingHub-CampaignMetrics`: Stores the simulated metrics from the marketing campaigns.
*   **Amazon Bedrock (Claude 3 Sonnet):** The core AI engine for the application. Used for:
    *   Generating business plans in a multi-step, agent-like workflow.
    *   Refining existing plans based on user feedback.
    *   Generating recommendations for campaign optimization.
    *   Powering the Monitoring Agent's analysis.
*   **Amazon Textract:** Used to extract text from uploaded PDF documents.
*   **Amazon Rekognition:** Used to analyze uploaded images and videos.
*   **AWS Lambda ("Campaign Manager"):** A serverless function responsible for executing the (simulated) marketing campaigns when a plan is approved.
*   **DynamoDB Streams (Recommended):** The recommended way to trigger the Campaign Manager Lambda automatically when a plan's status is updated to `approved` in the `HarmonyMarketingHub-Results` table.

## Workflow

1.  **Input:** The user provides input either as text or by uploading a file (image, PDF, video).
2.  **Processing:** The `/api/process-input` endpoint uses Textract or Rekognition to process files and then uses a multi-step workflow with Bedrock to generate a detailed business plan.
3.  **Review & Approval:** The user reviews the plan in the dashboard and can approve it or request refinements.
4.  **Execution:** When a plan is approved, the Campaign Manager Lambda is triggered (simulated via a direct call in the "approve" endpoint, but ideally via a DynamoDB Stream). The Lambda executes the campaign by calling the (mock) integration modules.
5.  **Analytics & Monitoring:** The mock integrations generate and store simulated metrics in DynamoDB. The user can view these metrics on the dashboard and use the Monitoring Agent to analyze the performance and trigger further refinements, creating a closed-loop system.
