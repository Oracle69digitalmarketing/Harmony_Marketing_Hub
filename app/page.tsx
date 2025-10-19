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
import { FileUpload } from "@/components/ui/file-upload"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Dashboard() {
  const [text, setText] = useState("");
  const [processedData, setProcessedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refinementInstruction, setRefinementInstruction] = useState("");
  const [campaignMetrics, setCampaignMetrics] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [monitoringResult, setMonitoringResult] = useState<any>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setCampaignMetrics(data);
    };
    fetchMetrics();
  }, []);

  const handleTextSubmit = async () => {
    if (!text) return;

    setIsLoading(true);
    try {
      const processResponse = await fetch('/api/process-input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const processData = await processResponse.json();
      setProcessedData(processData);
    } catch (error) {
      console.error('Error during text processing:', error);
    }
    setIsLoading(false);
  };

  const handleApprove = async () => {
    if (!processedData?.resultId) return;
    await fetch(`/api/results/${processedData.resultId}/approve`, { method: 'POST' });
    // You might want to update the UI to reflect the approved status
  };

  const handleRefine = async () => {
    if (!processedData?.resultId || !refinementInstruction) return;

    setIsLoading(true);
    try {
      const refineResponse = await fetch(`/api/results/${processedData.resultId}/refine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refinementInstruction }),
      });

      const refinedData = await refineResponse.json();
      setProcessedData(refinedData);
    } catch (error) {
      console.error('Error during refinement:', error);
    }
    setIsLoading(false);
    setIsEditing(false);
    setRefinementInstruction("");
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metrics: campaignMetrics }),
      });
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
    setIsLoading(false);
  };

  const handleRunMonitoringAgent = async () => {
    if (!processedData?.resultId) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/monitoring-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: processedData.resultId }),
      });
      const data = await response.json();
      setMonitoringResult(data);
      if (data.refinedPlan) {
        setProcessedData(data.refinedPlan);
      }
    } catch (error) {
      console.error('Error running monitoring agent:', error);
    }
    setIsLoading(false);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      const data = await response.json();
      setGeneratedImage(data.image);
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setIsLoading(false);
  };

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
                <FileUpload />
                <div className="mt-4">
                  <h3 className="text-lg font-bold mb-2">Or enter text directly</h3>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your business idea or marketing copy here..."
                    className="mb-2"
                  />
                  <Button onClick={handleTextSubmit} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Process Text"}
                  </Button>
                </div>
                {processedData && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50 w-full">
                    <h3 className="text-lg font-bold">Generated Business Plan</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Executive Summary</h4>
                        <p>{processedData.aiResponse.executiveSummary}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Industry</h4>
                        <p>{processedData.aiResponse.industry}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Target Audience</h4>
                        <p>{processedData.aiResponse.targetAudience}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Value Proposition</h4>
                        <p>{processedData.aiResponse.valueProposition}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Marketing Channels</h4>
                        <ul className="list-disc list-inside">
                          {processedData.aiResponse.marketingChannels.map((channel: string, index: number) => (
                            <li key={index}>{channel}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold">KPIs</h4>
                        <ul className="list-disc list-inside">
                          {processedData.aiResponse.kpis.map((kpi: string, index: number) => (
                            <li key={index}>{kpi}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button onClick={handleApprove}>Approve</Button>
                      <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                    {isEditing && (
                      <div className="mt-4">
                        <Textarea
                          value={refinementInstruction}
                          onChange={(e) => setRefinementInstruction(e.target.value)}
                          placeholder="Enter instructions to refine the plan..."
                          className="mb-2"
                        />
                        <Button onClick={handleRefine} disabled={isLoading}>
                          {isLoading ? "Refining..." : "Submit Refinement"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Generation Section */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Images</CardTitle>
                <CardDescription>
                  Create images for your marketing campaigns using AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Enter a prompt to generate an image..."
                  className="mb-2"
                />
                <Button onClick={handleGenerateImage} disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Image"}
                </Button>
                {generatedImage && (
                  <div className="mt-4">
                    <img src={`data:image/png;base64,${generatedImage}`} alt="Generated Image" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Overview of your simulated campaign metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.isArray(campaignMetrics) && campaignMetrics.map((metric, index) => (
                  <Link href={`/campaign/${encodeURIComponent(metric.channel.toLowerCase())}`} key={index}>
                    <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">{metric.channel}</CardTitle>
                        <DollarSign className="h-4 w-4 text-gray-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${metric.cost.toFixed(2)}</div>
                        <p className="text-xs text-gray-500">
                          {metric.impressions} impressions, {metric.clicks} clicks, {metric.conversions} conversions
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  ))}
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button onClick={handleGetRecommendations} disabled={isLoading}>
                    {isLoading ? "Generating..." : "Get AI Recommendations"}
                  </Button>
                  <Button onClick={handleRunMonitoringAgent} disabled={!processedData || isLoading}>
                    {isLoading ? "Running..." : "Run Monitoring Agent"}
                  </Button>
                </div>
                {recommendations && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50 w-full">
                    <h3 className="text-lg font-bold">AI Recommendations</h3>
                    <ul className="list-disc list-inside">
                      {recommendations.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {monitoringResult && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50 w-full">
                    <h3 className="text-lg font-bold">Monitoring Agent Result</h3>
                    <p>{monitoringResult.message}</p>
                    {monitoringResult.analysis && (
                      <pre className="whitespace-pre-wrap mt-2">{JSON.stringify(monitoringResult.analysis, null, 2)}</pre>
                    )}
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