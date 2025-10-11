"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Brain,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react"
import { FileUploader } from "@/components/ui/file-uploader"

const metrics = [
  {
    title: "Total Campaign ROI",
    value: "324%",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    title: "Active Campaigns",
    value: "47",
    change: "+3",
    trend: "up",
    icon: Target,
    color: "text-blue-600",
  },
  {
    title: "Monthly Budget",
    value: "$125,430",
    change: "-2.1%",
    trend: "down",
    icon: DollarSign,
    color: "text-purple-600",
  },
  {
    title: "Total Leads",
    value: "12,847",
    change: "+18.2%",
    trend: "up",
    icon: Users,
    color: "text-orange-600",
  },
]

const campaigns = [
  {
    name: "Q1 Product Launch",
    status: "active",
    budget: "$45,000",
    spent: "$32,100",
    roi: "287%",
    progress: 71,
  },
  {
    name: "Brand Awareness Campaign",
    status: "optimizing",
    budget: "$28,500",
    spent: "$19,200",
    roi: "156%",
    progress: 67,
  },
  {
    name: "Holiday Promotion",
    status: "paused",
    budget: "$15,000",
    spent: "$8,900",
    roi: "203%",
    progress: 59,
  },
]

const aiInsights = [
  {
    type: "opportunity",
    title: "Budget Reallocation Recommended",
    description: "AI suggests moving $5,200 from underperforming Facebook ads to Google Ads for 23% ROI increase.",
    priority: "high",
    icon: Brain,
  },
  {
    type: "alert",
    title: "Compliance Check Required",
    description: "New GDPR requirements detected for EU campaigns. Review needed before next deployment.",
    priority: "medium",
    icon: AlertTriangle,
  },
  {
    type: "success",
    title: "A/B Test Winner Identified",
    description: "Email variant B shows 34% higher conversion rate. Auto-implementation scheduled.",
    priority: "low",
    icon: CheckCircle,
  },
]

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Marketing Harmony Hub</h1>
                <p className="text-gray-600 mt-1">AI-powered marketing orchestration at your fingertips</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Brain className="mr-2 h-4 w-4" />
                AI Recommendations
              </Button>
            </div>

            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Start Here: Upload Your Data</CardTitle>
                <CardDescription>
                  Upload marketing materials, business plans, or competitor analysis to fuel the AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader />
              </CardContent>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center text-xs text-gray-600">
                      {metric.trend === "up" ? (
                        <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                      )}
                      <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>{metric.change}</span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Campaigns */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Active Campaigns</CardTitle>
                  <CardDescription>Monitor and optimize your running campaigns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaigns.map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{campaign.name}</h3>
                          <Badge
                            variant={
                              campaign.status === "active"
                                ? "default"
                                : campaign.status === "optimizing"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Budget: {campaign.budget}</span>
                          <span>Spent: {campaign.spent}</span>
                          <span className="text-green-600 font-medium">ROI: {campaign.roi}</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                  <CardDescription>Smart recommendations for optimization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div
                        className={`p-2 rounded-full ${
                          insight.type === "opportunity"
                            ? "bg-blue-100"
                            : insight.type === "alert"
                              ? "bg-yellow-100"
                              : "bg-green-100"
                        }`}
                      >
                        <insight.icon
                          className={`h-4 w-4 ${
                            insight.type === "opportunity"
                              ? "text-blue-600"
                              : insight.type === "alert"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {insight.priority} priority
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <Target className="h-6 w-6" />
                    <span className="text-sm">New Campaign</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">View Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <Brain className="h-6 w-6" />
                    <span className="text-sm">AI Scenarios</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <DollarSign className="h-6 w-6" />
                    <span className="text-sm">Budget Optimizer</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
