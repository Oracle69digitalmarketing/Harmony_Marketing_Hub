"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Brain, TrendingUp, DollarSign, Target, Lightbulb, Play, Save } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"

const scenarioData = [
  { month: "Jan", conservative: 15000, moderate: 22000, aggressive: 35000 },
  { month: "Feb", conservative: 18000, moderate: 28000, aggressive: 42000 },
  { month: "Mar", conservative: 22000, moderate: 35000, aggressive: 55000 },
  { month: "Apr", conservative: 25000, moderate: 40000, aggressive: 65000 },
  { month: "May", conservative: 28000, moderate: 45000, aggressive: 75000 },
  { month: "Jun", conservative: 32000, moderate: 52000, aggressive: 88000 },
]

const channelAllocation = [
  { channel: "Google Ads", current: 35, optimized: 42 },
  { channel: "Facebook", current: 25, optimized: 28 },
  { channel: "LinkedIn", current: 15, optimized: 18 },
  { channel: "Email", current: 10, optimized: 8 },
  { channel: "Display", current: 15, optimized: 4 },
]

export default function ScenariosPage() {
  const [budgetSlider, setBudgetSlider] = useState([100000])
  const [timeframe, setTimeframe] = useState(6)
  const [riskLevel, setRiskLevel] = useState("moderate")

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
                <h1 className="text-3xl font-bold text-gray-900">AI Scenario Planning</h1>
                <p className="text-gray-600 mt-1">Simulate campaign outcomes with predictive analytics</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save Scenario
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Scenario Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-blue-600" />
                    Scenario Parameters
                  </CardTitle>
                  <CardDescription>Adjust variables to simulate different outcomes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Total Budget</label>
                    <Slider
                      value={budgetSlider}
                      onValueChange={setBudgetSlider}
                      max={500000}
                      min={10000}
                      step={5000}
                      className="mb-2"
                    />
                    <div className="text-sm text-gray-600">${budgetSlider[0].toLocaleString()}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Timeframe (months)</label>
                    <Slider
                      value={[timeframe]}
                      onValueChange={(value) => setTimeframe(value[0])}
                      max={12}
                      min={1}
                      step={1}
                      className="mb-2"
                    />
                    <div className="text-sm text-gray-600">{timeframe} months</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Risk Level</label>
                    <div className="space-y-2">
                      {["conservative", "moderate", "aggressive"].map((level) => (
                        <Button
                          key={level}
                          variant={riskLevel === level ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setRiskLevel(level)}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">AI Recommendations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Increase Google Ads by 20%</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Reduce Display spend by 60%</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Focus on mobile targeting</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scenario Results */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projected Revenue Scenarios</CardTitle>
                    <CardDescription>Expected outcomes based on different risk levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        conservative: {
                          label: "Conservative",
                          color: "hsl(var(--chart-1))",
                        },
                        moderate: {
                          label: "Moderate",
                          color: "hsl(var(--chart-2))",
                        },
                        aggressive: {
                          label: "Aggressive",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={scenarioData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="conservative"
                            stroke="var(--color-conservative)"
                            strokeWidth={2}
                            name="Conservative"
                          />
                          <Line
                            type="monotone"
                            dataKey="moderate"
                            stroke="var(--color-moderate)"
                            strokeWidth={2}
                            name="Moderate"
                          />
                          <Line
                            type="monotone"
                            dataKey="aggressive"
                            stroke="var(--color-aggressive)"
                            strokeWidth={2}
                            name="Aggressive"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Optimized Channel Allocation</CardTitle>
                    <CardDescription>AI-recommended budget distribution vs current allocation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        current: {
                          label: "Current",
                          color: "hsl(var(--chart-1))",
                        },
                        optimized: {
                          label: "Optimized",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={channelAllocation}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="channel" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="current" fill="var(--color-current)" name="Current %" />
                          <Bar dataKey="optimized" fill="var(--color-optimized)" name="Optimized %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Scenario Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Expected ROI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">287%</div>
                  <p className="text-sm text-gray-600 mt-1">+23% improvement over current performance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-600">
                    <Target className="mr-2 h-5 w-5" />
                    Projected Leads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">18,450</div>
                  <p className="text-sm text-gray-600 mt-1">Based on optimized allocation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-600">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Cost per Lead
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$5.42</div>
                  <p className="text-sm text-gray-600 mt-1">-18% reduction from current CPL</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
