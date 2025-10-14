# Integration Testing Plan

This plan outlines the steps to test the end-to-end workflow of the Harmony Marketing Hub application.

## Prerequisites

*   The application is running locally (`npm run dev`).
*   You have configured your AWS credentials in your local environment.
*   You have created the necessary DynamoDB tables (`HarmonyMarketingHub-Results`, `HarmonyMarketingHub-CampaignMetrics`).

## Test Case 1: End-to-End Workflow with Text Input

1.  **Step 1: Submit Text Input**
    *   Open the application in your browser.
    *   In the "Start Here" section, enter a business idea in the text area (e.g., "A subscription box for eco-friendly products").
    *   Click the "Process Text" button.
    *   **Expected Result:** A "Generated Business Plan" card appears with a structured business plan.

2.  **Step 2: Approve the Plan**
    *   In the "Generated Business Plan" card, click the "Approve" button.
    *   **Expected Result:**
        *   The UI might show a confirmation message.
        *   In your terminal, you should see the logs from the simulated campaign execution (e.g., "--- SIMULATING EMAIL ---").

3.  **Step 3: Verify Metrics**
    *   Navigate to the `/api/metrics` endpoint in your browser (or use a tool like Postman).
    *   **Expected Result:** You should see a JSON response containing the simulated metrics for the executed campaigns.

4.  **Step 4: Get AI Recommendations**
    *   Go back to the main dashboard.
    *   In the "Campaign Performance" card, click the "Get AI Recommendations" button.
    *   **Expected Result:** An "AI Recommendations" section appears with a list of recommendations.

5.  **Step 5: Run Monitoring Agent**
    *   In the "Campaign Performance" card, click the "Run Monitoring Agent" button.
    *   **Expected Result:** A "Monitoring Agent Result" section appears with the agent's analysis. If the agent decided that a refinement is needed, the business plan should be updated with the refined version.

## Test Case 2: Refine the Plan

1.  **Step 1: Generate a Plan**
    *   Follow Step 1 from Test Case 1 to generate a new business plan.

2.  **Step 2: Edit the Plan**
    *   In the "Generated Business Plan" card, click the "Edit" button.
    *   An input field for refinement instructions should appear.
    *   Enter an instruction (e.g., "Make the executive summary more optimistic").
    *   Click the "Submit Refinement" button.
    *   **Expected Result:** The business plan should be updated with the refined content.
