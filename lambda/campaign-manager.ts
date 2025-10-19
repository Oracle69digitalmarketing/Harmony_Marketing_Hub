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

  if (!plan.marketingChannels || plan.marketingChannels.length === 0)
    return { success: false, message: "No marketing channels to execute." };

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

      case "whatsapp":
        console.log("  -> Sending WhatsApp messages via Twilio...");
        const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        try {
          await client.messages.create({
            body: plan.valueProposition || "Check out our new product!",
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: "whatsapp:+1234567890",
          });
          console.log("    -> WhatsApp message sent successfully via Twilio.");
        } catch (error) {
          console.error("    -> Error sending WhatsApp message:", error);
        }
        break;

      case "social media":
        console.log("  -> Posting on social media (not implemented)...");
        break;

      default:
        console.log(`  -> Unknown channel: ${channel}`);
        break;
    }
  }

  console.log("--- Campaign Execution Finished ---");
  return { success: true, message: "Campaign execution simulated successfully." };
};
