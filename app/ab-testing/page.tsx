'''use client'''

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { BeakerIcon, GoalIcon } from "lucide-react"

interface ABTest {
  testId: string;
  testName: string;
  status: 'running' | 'completed';
  versionA_visitors: number;
  versionA_conversions: number;
  versionB_visitors: number;
  versionB_conversions: number;
}

export default function ABTestingPage() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/ab-tests');
        if (!response.ok) {
          throw new Error('Failed to fetch A/B test data');
        }
        const data = await response.json();
        setTests(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  const calculateCR = (conversions: number, visitors: number) => {
    if (visitors === 0) return '0.00';
    return ((conversions / visitors) * 100).toFixed(2);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">A/B Testing Dashboard</h1>
            
            {isLoading && <p>Loading tests...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error && tests.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>No A/B Tests Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>There are currently no A/B tests running. New tests will appear here once they are created.</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => {
                const crA = calculateCR(test.versionA_conversions, test.versionA_visitors);
                const crB = calculateCR(test.versionB_conversions, test.versionB_visitors);
                const winner = +crA > +crB ? 'A' : 'B';

                return (
                  <Card key={test.testId}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{test.testName}</CardTitle>
                        <Badge variant={test.status === 'running' ? 'default' : 'secondary'}>
                          {test.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-around text-center">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Version A</p>
                          <p className="text-2xl font-bold">{crA}%</p>
                          <p className="text-xs text-muted-foreground">{test.versionA_conversions} / {test.versionA_visitors}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Version B</p>
                          <p className="text-2xl font-bold">{crB}%</p>
                          <p className="text-xs text-muted-foreground">{test.versionB_conversions} / {test.versionB_visitors}</p>
                        </div>
                      </div>
                      {test.status === 'completed' && (
                        <div className="text-center pt-2">
                            <p className="text-sm font-bold">Winner: <span className={`text-lg ${winner === 'A' ? 'text-blue-600' : 'text-green-600'}`}>Version {winner}</span></p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
