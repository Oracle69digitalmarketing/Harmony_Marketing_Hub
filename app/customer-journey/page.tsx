"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ChevronDown } from "lucide-react"

interface JourneyStage {
  stageOrder: number;
  stageName: string;
  userCount: number;
}

export default function CustomerJourneyPage() {
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/customer-journey');
        if (!response.ok) {
          throw new Error('Failed to fetch customer journey data');
        }
        const data = await response.json();
        setStages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxUsers = Math.max(...stages.map(s => s.userCount), 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Customer Journey Funnel</h1>

            <Card>
              <CardContent className="pt-6">
                {isLoading && <p>Loading journey data...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!isLoading && !error && stages.length === 0 && (
                    <div>
                        <h2 className="text-xl font-semibold">No Journey Data Found</h2>
                        <p>Customer journey data will appear here once it is available in the database.</p>
                    </div>
                )}

                <div className="space-y-2 flex flex-col items-center">
                  {stages.map((stage, index) => {
                    const widthPercentage = maxUsers > 0 ? (stage.userCount / maxUsers) * 100 : 0;
                    const conversionRate = index > 0 && stages[index-1].userCount > 0 
                        ? ((stage.userCount / stages[index-1].userCount) * 100).toFixed(1) 
                        : null;

                    return (
                      <div key={stage.stageOrder} className="w-full flex flex-col items-center">
                        <div className="text-center">
                          <p className="font-bold text-lg">{stage.stageName}</p>
                          <p className="text-2xl font-extrabold text-blue-600">{stage.userCount.toLocaleString()}</p>
                        </div>
                        <div 
                          className="h-12 bg-blue-500 rounded-md transition-all duration-500 ease-in-out" 
                          style={{ width: `${widthPercentage}%` }}
                        />
                        {conversionRate !== null && (
                            <div className="flex flex-col items-center my-2">
                                <ChevronDown className="h-6 w-6 text-gray-400" />
                                <p className="text-sm font-bold text-green-600">{conversionRate}%</p>
                            </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
