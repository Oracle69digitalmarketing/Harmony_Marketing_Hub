"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

// This is a placeholder for the actual data structure.
// In a real application, you would likely have a more robust type definition.
interface PlanData {
  businessPlan: {
    executiveSummary: string;
    missionStatement: string;
    targetAudience: string;
    swotAnalysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    financialProjections: string;
  };
  marketingStrategy: {
    marketingObjectives: string[];
    keyMessaging: string;
    channelStrategy: {
      [channel: string]: string;
    };
    budgetAllocation: {
      [channel: string]: string;
    };
    kpis: string[];
  };
}

export default function PlanPage({ params: { id } }: { params: { id: string } }) {
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      notFound();
      return;
    }

    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/generate-plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileId: id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the plan.");
        }
        const data = await response.json();
        setPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-lg">Generating your strategic plan...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-red-500">Error: {error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!plan) {
    return notFound();
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Your AI-Generated Plan</h1>

            <Card>
              <CardHeader>
                <CardTitle>Business Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Executive Summary</h3>
                  <p className="text-gray-700">{plan.businessPlan.executiveSummary}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Mission Statement</h3>
                  <p className="text-gray-700">{plan.businessPlan.missionStatement}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Target Audience</h3>
                  <p className="text-gray-700">{plan.businessPlan.targetAudience}</p>
                </div>
                <div>
                  <h3 className="font-semibold">SWOT Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg"><strong>Strengths:</strong> <ul className="list-disc pl-5 mt-1">{plan.businessPlan.swotAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                    <div className="p-4 bg-gray-50 rounded-lg"><strong>Weaknesses:</strong> <ul className="list-disc pl-5 mt-1">{plan.businessPlan.swotAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul></div>
                    <div className="p-4 bg-gray-50 rounded-lg"><strong>Opportunities:</strong> <ul className="list-disc pl-5 mt-1">{plan.businessPlan.swotAnalysis.opportunities.map((o, i) => <li key={i}>{o}</li>)}</ul></div>
                    <div className="p-4 bg-gray-50 rounded-lg"><strong>Threats:</strong> <ul className="list-disc pl-5 mt-1">{plan.businessPlan.swotAnalysis.threats.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Financial Projections</h3>
                  <p className="text-gray-700">{plan.businessPlan.financialProjections}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketing Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Marketing Objectives</h3>
                  <ul className="list-disc pl-5 space-y-1">{plan.marketingStrategy.marketingObjectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
                </div>
                <div>
                  <h3 className="font-semibold">Key Messaging</h3>
                  <p className="text-gray-700">{plan.marketingStrategy.keyMessaging}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Channel Strategy</h3>
                  {Object.entries(plan.marketingStrategy.channelStrategy).map(([channel, strategy]) => (
                    <div key={channel} className="mt-2"><strong>{channel}:</strong> {strategy}</div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold">Budget Allocation</h3>
                  {Object.entries(plan.marketingStrategy.budgetAllocation).map(([channel, allocation]) => (
                    <div key={channel} className="mt-2"><strong>{channel}:</strong> {allocation}</div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold">Key Performance Indicators (KPIs)</h3>
                  <ul className="list-disc pl-5 space-y-1">{plan.marketingStrategy.kpis.map((k, i) => <li key={i}>{k}</li>)}</ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}