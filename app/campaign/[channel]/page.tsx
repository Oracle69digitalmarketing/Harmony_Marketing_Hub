"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DollarSign, Eye, MousePointerClick, Percent, Users } from "lucide-react"

// Define the structure for the fetched data
interface CampaignData {
  channel: string;
  summary: {
    totalClicks: number;
    totalImpressions: number;
    clickThroughRate: string;
    conversionRate: string;
    costPerClick: string;
    totalCost: string;
  };
  chartData: { date: string; clicks: number; impressions: number }[];
  demographics: {
    topAgeRange: string;
    topGender: string;
    topLocation: string;
  };
}

export default function CampaignDetailPage({ params }: { params: { channel: string } }) {
  const [data, setData] = useState<CampaignData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const channelName = decodeURIComponent(params.channel).replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/campaign/${params.channel}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaign data');
        }
        const campaignData = await response.json();
        setData(campaignData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.channel]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading campaign data...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div className="flex h-screen items-center justify-center">No data available for this campaign.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Campaign Analytics: {data.channel}</h1>
            
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${data.summary.totalCost}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.summary.totalImpressions.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.summary.totalClicks.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Click-Through Rate (CTR)</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.summary.clickThroughRate}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.summary.conversionRate}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost Per Click (CPC)</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${data.summary.costPerClick}</div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Over Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="impressions" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

             {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Top Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Age Range</p>
                        <p className="text-lg font-bold">{data.demographics.topAgeRange}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="text-lg font-bold">{data.demographics.topGender}</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="text-lg font-bold">{data.demographics.topLocation}</p>
                    </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  )
}
