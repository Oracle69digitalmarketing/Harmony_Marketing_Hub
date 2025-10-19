import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Function to generate mock time-series data for a chart
const generateChartData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      clicks: Math.floor(Math.random() * 500) + 100,
      impressions: Math.floor(Math.random() * 5000) + 1000,
    });
  }
  return data;
};

export async function GET(request: NextRequest, { params }: { params: { channel: string } }) {
  const channelName = decodeURIComponent(params.channel);

  try {
    const command = new QueryCommand({
      TableName: process.env.DYNAMODB_CAMPAIGNMETRICS_TABLE,
      KeyConditionExpression: "channel = :channel",
      ExpressionAttributeValues: {
        ":channel": channelName,
      },
    });

    const { Items } = await docClient.send(command);

    if (!Items || Items.length === 0) {
      return NextResponse.json({ message: `Campaign '${channelName}' not found` }, { status: 404 });
    }

    const campaign = Items[0];

    // Construct the response, combining real DB data with simulated chart data
    const responseData = {
      channel: campaign.channel,
      summary: {
        totalClicks: campaign.clicks,
        totalImpressions: campaign.impressions,
        clickThroughRate: ((campaign.clicks / campaign.impressions) * 100).toFixed(2),
        conversionRate: campaign.conversions,
        costPerClick: (campaign.cost / campaign.clicks).toFixed(2),
        totalCost: campaign.cost.toFixed(2),
      },
      chartData: generateChartData(), // Chart data remains simulated
      demographics: {
        topAgeRange: campaign.topAgeRange || '25-34', // Fallback if not in DB
        topGender: campaign.topGender || 'Female',
        topLocation: campaign.topLocation || 'California, USA',
      },
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error(`Error fetching data for campaign '${channelName}':`, error);
    return NextResponse.json(
      { message: `Error fetching data for campaign '${channelName}'` },
      { status: 500 }
    );
  }
}
