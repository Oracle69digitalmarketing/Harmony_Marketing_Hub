"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

interface Plan {
  executiveSummary: string;
  marketAnalysis: string;
  financialPlan: string;
  marketingCampaigns: any[];
}

export default function PlanPage({ params }: { params: { fileId: string } }) {
  const { fileId } = params;
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fileId) {
      fetch(`/api/plan/${fileId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Plan not found");
          }
          return res.json();
        })
        .then((data) => {
          setPlan(data.plan);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load the plan. Please try again later.");
          setLoading(false);
        });
    }
  }, [fileId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!plan) {
    return <div>Plan not found</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Generated Business and Marketing Plan</h1>
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{plan.executiveSummary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{plan.marketAnalysis}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Financial Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{plan.financialPlan}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Marketing Campaigns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.marketingCampaigns.map((campaign, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">{campaign.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}