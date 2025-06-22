"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const budgetData = [
  { name: "Google Ads", value: 42, budget: 42000, spent: 38500, performance: "high" },
  { name: "Facebook", value: 28, budget: 28000, spent: 26200, performance: "medium" },
  { name: "LinkedIn", value: 18, budget: 18000, spent: 15800, performance: "high" },
  { name: "Email Marketing", value: 8, budget: 8000, spent: 7200, performance: "low" },
  { name: "Display Ads", value: 4, budget: 4000, spent: 3800, performance: "low" },
]

const performanceData = [
  { channel: "Google Ads", roi: 287, cpl: 4.2, trend: "up" },
  { channel: "Facebook", roi: 156, cpl: 6.8, trend: "down" },
  { channel: "LinkedIn", roi: 234, cpl: 12.5, trend: "up" },
  { channel: "Email", roi: 89, cpl: 2.1, trend: "down" },
  { channel: "Display", roi: 45, cpl: 15.2, trend: "down" },
]

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"]

export default function BudgetPage() {
  const [autoOptimization, setAutoOptimization] = useState(true)
  const [optimizationFrequency, setOptimizationFrequency] = useState([24])
  const [riskTolerance, setRiskTolerance] = useState([50])

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
                <h1 className="text-3xl font-bold text-gray-900">Budget Optimizer</h1>
                <p className="text-gray-600 mt-1">AI-powered real-time budget allocation and optimization</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Zap className="mr-2 h-4 w-4" />
                  Optimize Now
                </Button>
              </div>
            </div>

            {/* Optimization Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <RefreshCw className="mr-2 h-5 w-5 text-blue-600" />
                    Auto-Optimization Status
                  </span>
                  <Switch checked={autoOptimization} onCheckedChange={setAutoOptimization} />
                </CardTitle>
                <CardDescription>
                  {autoOptimization
                    ? "AI is actively monitoring and optimizing your budget allocation"
                    : "Auto-optimization is disabled. Manual approval required for changes"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Last optimization: 2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">ROI improved by 12.5%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">$3,200 reallocated today</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Budget Distribution</CardTitle>
                  <CardDescription>Real-time allocation across marketing channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      budget: {
                        label: "Budget %",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={budgetData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {budgetData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Optimization Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Settings</CardTitle>
                  <CardDescription>Configure AI optimization parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Optimization Frequency (hours)</label>
                    <Slider
                      value={optimizationFrequency}
                      onValueChange={setOptimizationFrequency}
                      max={168}
                      min={1}
                      step={1}
                      className="mb-2"
                    />
                    <div className="text-sm text-gray-600">Every {optimizationFrequency[0]} hours</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Risk Tolerance</label>
                    <Slider
                      value={riskTolerance}
                      onValueChange={setRiskTolerance}
                      max={100}
                      min={0}
                      step={5}
                      className="mb-2"
                    />
                    <div className="text-sm text-gray-600">
                      {riskTolerance[0]}% -{" "}
                      {riskTolerance[0] < 30 ? "Conservative" : riskTolerance[0] < 70 ? "Moderate" : "Aggressive"}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Pending Optimizations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="mr-2 h-4 w-4 text-blue-600" />
                          <span className="text-sm">Increase Google Ads by $2,500</span>
                        </div>
                        <Badge variant="secondary">+15% ROI</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center">
                          <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
                          <span className="text-sm">Reduce Display Ads by $1,800</span>
                        </div>
                        <Badge variant="destructive">Low Performance</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance & Budget Allocation</CardTitle>
                <CardDescription>Detailed breakdown of spending and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetData.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <div>
                          <h3 className="font-medium">{channel.name}</h3>
                          <p className="text-sm text-gray-600">
                            ${channel.spent.toLocaleString()} / ${channel.budget.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{performanceData[index]?.roi}%</div>
                          <div className="text-xs text-gray-500">ROI</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">${performanceData[index]?.cpl}</div>
                          <div className="text-xs text-gray-500">CPL</div>
                        </div>
                        <Badge
                          variant={
                            channel.performance === "high"
                              ? "default"
                              : channel.performance === "medium"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {channel.performance}
                        </Badge>
                        {performanceData[index]?.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Smart suggestions for budget optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">High Impact Opportunity</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Reallocate $5,200 from Display Ads to Google Ads for an estimated 23% ROI increase.
                    </p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Apply Recommendation
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Performance Alert</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Email marketing CPL has increased by 45%. Consider A/B testing new subject lines.
                    </p>
                    <Button size="sm" variant="outline" className="border-blue-600 text-blue-600">
                      View Details
                    </Button>
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
