// This is a mock API endpoint to supply detailed campaign data.
// In a real application, this would fetch data from a database.
import { NextRequest, NextResponse } from "next/server";

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
  const channel = decodeURIComponent(params.channel);

  // Generate mock data based on the channel name
  const mockData = {
    channel: channel.replace(/\b\w/g, l => l.toUpperCase()),
    summary: {
      totalClicks: Math.floor(Math.random() * 5000) + 1000,
      totalImpressions: Math.floor(Math.random() * 50000) + 10000,
      clickThroughRate: (Math.random() * 5 + 1).toFixed(2),
      conversionRate: (Math.random() * 2 + 0.5).toFixed(2),
      costPerClick: (Math.random() * 2 + 0.5).toFixed(2),
      totalCost: (Math.random() * 10000 + 2000).toFixed(2),
    },
    chartData: generateChartData(),
    demographics: {
      topAgeRange: '25-34',
      topGender: 'Female',
      topLocation: 'California, USA',
    },
  };

  return NextResponse.json(mockData);
}
