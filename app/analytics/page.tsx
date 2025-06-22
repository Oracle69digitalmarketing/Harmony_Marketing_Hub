"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Download,
  Calendar,
  Filter,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"

const performanceData = [
  { date: "2024-01-01", impressions: 45000, clicks: 2800, conversions: 156, revenue: 18500 },
  { date: "2024-01-02", impressions: 52000, clicks: 3200, conversions: 189, revenue: 22400 },
  { date: "2024-01-03", impressions: 48000, clicks: 2950, conversions: 167, revenue: 19800 },
  { date: "2024-01-04", impressions: 61000, clicks: 3800, conversions: 234, revenue: 28900 },
  { date: "2024-01-05", impressions: 58000, clicks: 3600, conversions: 198, revenue: 24500 },
  { date: "2024-01-06", impressions: 67000, clicks: 4100, conversions: 267, revenue: 32800 },
  { date: "2024-01-07", impressions: 72000, clicks: 4500, conversions: 289, revenue: 36200 },
]

const channelData = [
  { channel: "Google Ads", impressions: 285000, clicks: 18500, conversions: 1240, revenue: 156000 },
  { channel: "Facebook", impressions: 198000, clicks: 12800, conversions: 890, revenue: 98500 },
  { channel: "LinkedIn", impressions: 89000, clicks: 5600, conversions: 445, revenue: 67800 },
  { channel: "Email", impressions: 45000, clicks: 8900, conversions: 567, revenue: 45600 },
  { channel: "Display", impressions: 156000, clicks: 3200, conversions: 189, revenue: 23400 },
]

const conversionFunnelData = [
  { stage: "Impressions", value: 100, count: 773000 },
  { stage: "Clicks", value: 6.8, count: 52596 },
  { stage: "Visits", value: 4.2, count: 32466 },
  { stage: "Leads", value: 2.1, count: 16233 },
  { stage: "Customers", value: 0.5, count: 3865 },
]

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">Comprehensive marketing performance insights</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$391,300</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+18.2% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                  <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,331</div>
                  <div className="flex items-center text-xs text-blue-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+12.5% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6.8%</div>
                  <div className="flex items-center text-xs text-purple-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+2.1% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost Per Lead</CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24.12</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingDown className="mr-1 h-3 w-3" />
                    <span>-8.3% from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts */}
            <Tabs defaultValue="performance" className="space-y-4">
              <TabsList>
                <TabsTrigger value="performance">Performance Overview</TabsTrigger>
                <TabsTrigger value="channels">Channel Analysis</TabsTrigger>
                <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend</CardTitle>
                      <CardDescription>Daily revenue performance over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          revenue: {
                            label: "Revenue",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="var(--color-revenue)"
                              fill="var(--color-revenue)"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Conversion Metrics</CardTitle>
                      <CardDescription>Clicks and conversions over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          clicks: {
                            label: "Clicks",
                            color: "hsl(var(--chart-2))",
                          },
                          conversions: {
                            label: "Conversions",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="clicks" stroke="var(--color-clicks)" strokeWidth={2} />
                            <Line
                              type="monotone"
                              dataKey="conversions"
                              stroke="var(--color-conversions)"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="channels" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Performance Comparison</CardTitle>
                    <CardDescription>Revenue and conversion metrics by marketing channel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        revenue: {
                          label: "Revenue",
                          color: "hsl(var(--chart-1))",
                        },
                        conversions: {
                          label: "Conversions",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={channelData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="channel" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="revenue" fill="var(--color-revenue)" name="Revenue ($)" />
                          <Bar dataKey="conversions" fill="var(--color-conversions)" name="Conversions" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {channelData.map((channel, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{channel.channel}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-lg font-bold text-green-600">${channel.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{channel.conversions} conversions</div>
                        <div className="text-xs text-gray-500">
                          CTR: {((channel.clicks / channel.impressions) * 100).toFixed(2)}%
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="funnel" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel Analysis</CardTitle>
                    <CardDescription>Track user journey from impression to conversion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {conversionFunnelData.map((stage, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-24 text-sm font-medium">{stage.stage}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">{stage.count.toLocaleString()}</span>
                              <span className="text-sm font-medium">{stage.value}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${stage.value}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
