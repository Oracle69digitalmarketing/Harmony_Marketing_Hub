import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export const executeCampaign = async (plan) => {
  console.log("--- Starting Campaign Execution ---");

  for (const channel of plan.marketingChannels) {
    console.log(`Executing campaign on channel: ${channel}`);

    switch (channel.toLowerCase()) {
      case "email":
        console.log("  -> Sending marketing emails via SES...");
        const sesClient = new SESClient({ region: process.env.AWS_REGION });
        const emailParams = {
          Source: "your-verified-email@example.com",
          Destination: { ToAddresses: ["customer1@example.com"] },
          Message: {
            Subject: { Data: plan.executiveSummary || "A Special Offer" },
            Body: { Text: { Data: plan.valueProposition || "Check out our new product!" } },
          },
        };
        try {
          await sesClient.send(new SendEmailCommand(emailParams));
          console.log("    -> Email sent successfully via SES.");
        } catch (error) {
          console.error("    -> Error sending email:", error);
        }
        break;
    }
  }
};
