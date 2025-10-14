# Harmony Marketing Hub

**Harmony Marketing Hub** is an AI-powered agent that automates the entire marketing lifecycle, from strategy and planning to execution and analysis. Built for the AWS AI Agent Global Hackathon, this project showcases the power of Amazon Bedrock and other AWS services to create intelligent, autonomous systems.

## Features

*   **AI-Powered Plan Generation:** Describe your business idea in plain English, and the agent will generate a comprehensive business and marketing plan, including target audience analysis, marketing channels, and KPIs.
*   **Multi-Step Reasoning:** The agent uses a multi-step reasoning process to generate the plan, ensuring a detailed and well-structured output.
*   **User Review and Refinement:** Review the generated plan and refine it with natural language instructions.
*   **Autonomous Campaign Execution:** Once a plan is approved, the agent's Campaign Manager autonomously executes the marketing campaigns across all the recommended channels (simulated).
*   **Real-Time Analytics:** The dashboard displays simulated real-time metrics of the campaign performance.
*   **Self-Improving System:** A Monitoring Agent autonomously analyzes the campaign performance and can trigger refinements to the marketing plan, creating a closed-loop, self-improving system.

## Architecture

For a detailed overview of the application's architecture, please see the [architecture.md](architecture.md) file.

## Getting Started

To run this project locally, you will need to have Node.js and npm installed. You will also need an AWS account with the necessary credentials configured in your environment.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install the dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your environment variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables:
    ```
    AWS_REGION=your-aws-region
    AWS_ACCESS_KEY_ID=your-aws-access-key-id
    AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
    S3_BUCKET_NAME=your-s3-bucket-name
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```
4.  **Create the DynamoDB tables:**
    You will need to create two DynamoDB tables in your AWS account:
    *   `HarmonyMarketingHub-Results` (with `id` as the primary key)
    *   `HarmonyMarketingHub-CampaignMetrics` (with `id` as the primary key)
5.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## GitHub Repository Checklist for Submission

Before submitting your project, please make sure to go through the following checklist to ensure your repository is clean, well-documented, and ready for review.

*   [ ] **Clean Commit History:** Rebase your feature branches and create a clean, linear commit history on your `main` branch.
*   [ ] **Remove Unnecessary Files:** Remove any temporary files, logs, or local environment files (like `.env.local`) from the repository. Ensure your `.gitignore` file is properly configured.
*   [ ] **Add Code Comments:** Add comments to any complex or non-obvious parts of your code to explain the *why*, not the *what*.
*   [ ] **Write a Compelling `README.md`:** Your `README.md` is the first thing the judges will see. Make sure it includes:
    *   A clear and concise project description.
    *   A list of the key features.
    *   A link to your architecture diagram.
    *   Clear instructions on how to run the project locally.
    *   A link to your live demo (if available).
*   [ ] **Provide a Demo Video:** Create a 3-minute demo video that showcases the end-to-end workflow of your application. See the [demo_script.md](demo_script.md) for a sample script.
*   [ ] **Check for Exposed Credentials:** Double-check your entire codebase and commit history to ensure you have not accidentally committed any API keys or other sensitive credentials.
*   [ ] **Test Your Application:** Run through the integration testing plan in [test.md](test.md) to make sure everything is working as expected.
*   [ ] **Provide a Live URL:** If you have deployed your application, make sure to include the live URL in your submission.