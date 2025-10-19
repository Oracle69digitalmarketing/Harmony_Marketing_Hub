'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader } from "lucide-react";

interface Competitor {
  name: string;
  website: string;
  socialMedia: {
    twitter: string;
    facebook: string;
  };
  seo: {
    keywords: string[];
    backlinks: number;
  };
}

export default function CompetitorAnalyticsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddCompetitor = async () => {
    if (!newCompetitor) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/competitor-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website: newCompetitor }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An unknown error occurred.');
      }

      const data = await response.json();
      setCompetitors([...competitors, data]);
      setNewCompetitor("");
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
                <CardTitle>Competitor Analytics</CardTitle>
                <CardDescription>Track and analyze your competitors' marketing activities.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    placeholder="Enter competitor website (e.g., competitor.com)"
                  />
                  <Button onClick={handleAddCompetitor} disabled={isLoading || !newCompetitor}>
                    {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : "Add Competitor"}
                  </Button>
                </div>

                {error && (
                  <div className="p-4 border rounded-lg bg-red-50 text-red-700">
                    <h3 className="text-lg font-semibold mb-2">An Error Occurred</h3>
                    <p>{error}</p>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Competitor</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Twitter</TableHead>
                      <TableHead>Facebook</TableHead>
                      <TableHead>Top Keywords</TableHead>
                      <TableHead>Backlinks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitors.map((competitor, index) => (
                      <TableRow key={index}>
                        <TableCell>{competitor.name}</TableCell>
                        <TableCell>{competitor.website}</TableCell>
                        <TableCell>{competitor.socialMedia.twitter}</TableCell>
                        <TableCell>{competitor.socialMedia.facebook}</TableCell>
                        <TableCell>{competitor.seo.keywords.join(", ")}</TableCell>
                        <TableCell>{competitor.seo.backlinks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}