import { DynamoDBStreamEvent } from 'aws-lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { sendEmail } from '../../lib/campaign-integrations/email';
import { sendWhatsAppMessage } from '../../lib/campaign-integrations/whatsapp';
import { postToSocialMedia } from '../../lib/campaign-integrations/social-media';

export const handler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    if (record.eventName === 'MODIFY') {
      const oldImage = record.dynamodb?.OldImage ? unmarshall(record.dynamodb.OldImage as any) : null;
      const newImage = record.dynamodb?.NewImage ? unmarshall(record.dynamodb.NewImage as any) : null;

      if (newImage?.status === 'approved' && oldImage?.status !== 'approved') {
        console.log(`Executing campaign for plan: ${newImage.id}`);
        await executeCampaign(newImage.aiResponse);
      }
    }
  }
};

export async function executeCampaign(plan: any) {
  const { marketingChannels, executiveSummary, targetAudience } = plan;

  for (const channel of marketingChannels) {
    const channelName = channel.toLowerCase();
    if (channelName.includes('email')) {
      await sendEmail(
        'New Marketing Campaign',
        `Hello! Here is our new marketing campaign based on your interests:\n\n${executiveSummary}`,
        'customer@example.com' // In a real app, you would get this from your user database
      );
    } else if (channelName.includes('whatsapp')) {
      await sendWhatsAppMessage(
        `New campaign for you: ${executiveSummary}`,
        '+1234567890' // In a real app, you would get this from your user database
      );
    } else if (channelName.includes('social media')) {
      // This is a simplification. A real implementation would be more sophisticated.
      await postToSocialMedia('Twitter', `New campaign launch! ${executiveSummary}`);
      await postToSocialMedia('Facebook', `New campaign launch! ${executiveSummary}`);
    }
  }
}
