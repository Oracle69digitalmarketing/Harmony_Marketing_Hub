'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Loader } from "lucide-react"

export default function GrowthAgentPage() {
  const [idea, setIdea] = useState("");
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStrategy = async () => {
    if (!idea) return;

    setIsGeneratingStrategy(true);
    setError(null);
    setGeneratedStrategy(null);

    try {
      const response = await fetch('/api/generate-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An unknown error occurred.');
      }

      const data = await response.json();
      setGeneratedStrategy(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingStrategy(false);
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
                <CardTitle>Autonomous Growth Agent</CardTitle>
                <CardDescription>Enter your business idea and get a comprehensive growth strategy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="e.g., 'A subscription box for dog toys'"
                    className="mb-2"
                  />
                  <Button onClick={handleGenerateStrategy} disabled={isGeneratingStrategy || !idea}>
                    {isGeneratingStrategy ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Generating Strategy...</> : "Generate Strategy"}
                  </Button>
                </div>

                {error && (
                  <div className="p-4 border rounded-lg bg-red-50 text-red-700">
                    <h3 className="text-lg font-semibold mb-2">An Error Occurred</h3>
                    <p>{error}</p>
                  </div>
                )}

                {generatedStrategy && (
                  <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                    <h3 className="text-xl font-bold mb-4">Generated Growth Strategy</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg">Market Research</h4>
                        <p className="text-muted-foreground">{generatedStrategy.marketResearch}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Competitor Analysis</h4>
                        <p className="text-muted-foreground">{generatedStrategy.competitorAnalysis}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">SWOT Analysis</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold">Strengths</h5>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {generatedStrategy.swotAnalysis.strengths.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold">Weaknesses</h5>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {generatedStrategy.swotAnalysis.weaknesses.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold">Opportunities</h5>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {generatedStrategy.swotAnalysis.opportunities.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold">Threats</h5>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {generatedStrategy.swotAnalysis.threats.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Marketing Strategy</h4>
                        <p><strong>Target Audience:</strong> {generatedStrategy.marketingStrategy.targetAudience}</p>
                        <p><strong>Value Proposition:</strong> {generatedStrategy.marketingStrategy.valueProposition}</p>
                        <h5 className="font-semibold mt-2">Channels</h5>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {generatedStrategy.marketingStrategy.channels.map((item: string, index: number) => <li key={index}>{item}</li>)}
                        </ul>
                        <h5 className="font-semibold mt-2">Content Calendar</h5>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {generatedStrategy.marketingStrategy.contentCalendar.map((item: any, index: number) => <li key={index}><strong>{item.month}:</strong> {item.content}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Financial Projections</h4>
                        <p><strong>Startup Costs:</strong> ${generatedStrategy.financialProjections.startupCosts}</p>
                        <h5 className="font-semibold mt-2">Revenue Forecast</h5>
                        <p>Year 1: ${generatedStrategy.financialProjections.revenueForecast.year1}</p>
                        <p>Year 2: ${generatedStrategy.financialProjections.revenueForecast.year2}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Roadmap</h4>
                        <ul className="list-decimal list-inside text-muted-foreground">
                          {generatedStrategy.roadmap.map((item: any, index: number) => <li key={index}>{item.task}</li>)}
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
