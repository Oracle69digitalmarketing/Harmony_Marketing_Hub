'''use client'''

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { GitCommit, DollarSign, Users } from "lucide-react"

interface AttributionModel {
  modelId: string;
  modelName: string;
  attributedConversions: number;
  attributedRevenue: number;
}

export default function AttributionPage() {
  const [models, setModels] = useState<AttributionModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/attribution');
        if (!response.ok) {
          throw new Error('Failed to fetch attribution data');
        }
        const data = await response.json();
        setModels(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Attribution Modeling</h1>

            {isLoading && <p>Loading attribution models...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error && models.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>No Attribution Data Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Attribution model data will appear here once it is available in the database.</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <Card key={model.modelId}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{model.modelName}</CardTitle>
                    <GitCommit className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Users className="h-6 w-6 text-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Attributed Conversions</p>
                            <p className="text-2xl font-bold">{model.attributedConversions.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DollarSign className="h-6 w-6 text-green-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Attributed Revenue</p>
                            <p className="text-2xl font-bold">${model.attributedRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
