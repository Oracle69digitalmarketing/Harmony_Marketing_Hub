"use client";

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Loader } from "lucide-react"

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the structure for the generated plan
interface GeneratedPlan {
  executiveSummary: string;
  industry: string;
  targetAudience: string;
  valueProposition: string;
  marketingChannels: string[];
  kpis: string[];
}

export default function ScenarioRunnerPage() {
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunScenario = async () => {
    if (!goal) return;

    setIsLoading(true);
    setError(null);
    setGeneratedPlan(null);

    try {
      const response = await fetch('/api/run-scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal, budget, timeframe, riskLevel }),
      });

      // Correctly handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An unknown error occurred while processing the request.');
      }

      const plan = await response.json();
      setGeneratedPlan(plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Scenario Runner</CardTitle>
                <CardDescription>Define a high-level goal and the autonomous agent will generate a complete business and marketing plan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., 'Launch a marketing campaign for a new artisanal coffee shop in San Francisco'"
                    className="mb-2"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget ($)</label>
                      <Input type="number" id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g., 10000" />
                    </div>
                    <div>
                      <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">Timeframe (Months)</label>
                      <Input type="number" id="timeframe" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="e.g., 6" />
                    </div>
                    <div>
                      <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700">Risk Level</label>
                      <Select value={riskLevel} onValueChange={setRiskLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleRunScenario} disabled={isLoading || !goal || !budget || !timeframe || !riskLevel}>
                    {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Run Scenario"}
                  </Button>
                </div>

                {error && (
                  <div className="p-4 border rounded-lg bg-red-50 text-red-700">
                    <h3 className="text-lg font-semibold mb-2">An Error Occurred</h3>
                    <p>{error}</p>
                  </div>
                )}

                {generatedPlan && (
                  <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                    <h3 className="text-xl font-bold mb-4">Generated Business Plan</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg">Executive Summary</h4>
                        <p className="text-muted-foreground">{generatedPlan.executiveSummary}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Industry</h4>
                        <p className="text-muted-foreground">{generatedPlan.industry}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Target Audience</h4>
                        <p className="text-muted-foreground">{generatedPlan.targetAudience}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Value Proposition</h4>
                        <p className="text-muted-foreground">{generatedPlan.valueProposition}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Marketing Channels</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {generatedPlan.marketingChannels.map((channel, index) => (
                            <li key={index}>{channel}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Key Performance Indicators (KPIs)</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {generatedPlan.kpis.map((kpi, index) => (
                            <li key={index}>{kpi}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
