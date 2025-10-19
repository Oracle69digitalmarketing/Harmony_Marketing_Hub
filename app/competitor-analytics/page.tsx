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
                    <p>Failed to edit, 0 occurrences found for old_string ('use client'\n\nimport { useState } from "react"\nimport { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"\nimport { Button } from "@/components/ui/button"\nimport { Sidebar } from "@/components/sidebar"\nimport { Header } from "@/components/header"\nimport { Input } from "@/components/ui/input"\nimport { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"\n\nconst initialCompetitors = [\n  {\n    name: "Competitor A",\n    website: "competitor-a.com",\n    socialMedia: {\n      twitter: "@competitorA",\n      facebook: "/competitorA",\n    },\n    seo: {\n      keywords: ["keyword1", "keyword2", "keyword3"],\n      backlinks: 1200,\n    },\n  },\n  {\n    name: "Competitor B",\n    website: "competitor-b.com",\n    socialMedia: {\n      twitter: "@competitorB",\n      facebook: "/competitorB",\n    },\n    seo: {\n      keywords: ["keyword4", "keyword5", "keyword6"],\n      backlinks: 800,\n    },\n  },\n];\n\nexport default function CompetitorAnalyticsPage() {\n  const [competitors, setCompetitors] = useState(initialCompetitors);\n  const [newCompetitor, setNewCompetitor] = useState("");\n\n  const handleAddCompetitor = () => {\n    if (!newCompetitor) return;\n    // In a real app, you would fetch data for the new competitor\n    setCompetitors([...competitors, { \n      name: newCompetitor, \n      website: `${newCompetitor.toLowerCase().replace(/\\s+/g, '-')}.com`, \n      socialMedia: { twitter: "", facebook: "" }, \n      seo: { keywords: [], backlinks: 0 } \n    }]);\n    setNewCompetitor("");\n  };\n\n  return (\n    <div className="flex h-screen bg-gray-50">\n      <Sidebar />\n      <div className="flex-1 flex flex-col overflow-hidden">\n        <Header />\n        <main className="flex-1 overflow-y-auto p-6">\n          <div className="max-w-7xl mx-auto space-y-6">\n            <Card>\n              <CardHeader>\n                <CardTitle>Competitor Analytics</CardTitle>\n                <CardDescription>Track and analyze your competitors' marketing activities.</CardDescription>\n              </CardHeader>\n              <CardContent className="space-y-4">\n                <div className="flex space-x-2">\n                  <Input \n                    value={newCompetitor}\n                    onChange={(e) => setNewCompetitor(e.target.value)}\n                    placeholder="Enter competitor name"\n                  />\n                  <Button onClick={handleAddCompetitor}>Add Competitor</Button>\n                </div>\n\n                <Table>\n                  <TableHeader>\n                    <TableRow>\n                      <TableHead>Competitor</TableHead>\n                      <TableHead>Website</_TableHead>\n                      <TableHead>Twitter</TableHead>\n                      <TableHead>Facebook</TableHead>\n                      <TableHead>Top Keywords</TableHead>\n                      <TableHead>Backlinks</TableHead>\n                    </TableRow>\n                  </TableHeader>\n                  <TableBody>\n                    {competitors.map((competitor, index) => (\n                      <TableRow key={index}>\n                        <TableCell>{competitor.name}</TableCell>\n                        <TableCell>{competitor.website}</TableCell>\n                        <TableCell>{competitor.socialMedia.twitter}</TableCell>\n                        <TableCell>{competitor.socialMedia.facebook}</TableCell>\n                        <TableCell>{competitor.seo.keywords.join(", ")}</TableCell>\n                        <TableCell>{competitor.seo.backlinks}</TableCell>\n                      </TableRow>\n                    ))}\n                  </TableBody>\n                </Table>\n\n              </CardContent>\n            </Card>\n          </div>\n        </main>\n      </div>\n    </div>\n  )\n}\n). Original old_string was ('use client'\n\nimport { useState } from "react"\nimport { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"\nimport { Button } from "@/components/ui/button"\nimport { Sidebar } from "@/components/sidebar"\nimport { Header } from "@/components/header"\nimport { Input } from "@/components/ui/input"\nimport { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"\n\nconst initialCompetitors = [\n  {\n    name: "Competitor A",\n    website: "competitor-a.com",\n    socialMedia: {\n      twitter: "@competitorA",\n      facebook: "/competitorA",\n    },\n    seo: {\n      keywords: ["keyword1", "keyword2", "keyword3"],\n      backlinks: 1200,\n    },\n  },\n  {\n    name: "Competitor B",\n    website: "competitor-b.com",\n    socialMedia: {\n      twitter: "@competitorB",\n      facebook: "/competitorB",\n    },\n    seo: {\n      keywords: ["keyword4", "keyword5", "keyword6"],\n      backlinks: 800,\n    },\n  },\n];\n\nexport default function CompetitorAnalyticsPage() {\n  const [competitors, setCompetitors] = useState(initialCompetitors);\n  const [newCompetitor, setNewCompetitor] = useState("");\n\n  const handleAddCompetitor = () => {\n    if (!newCompetitor) return;\n    // In a real app, you would fetch data for the new competitor\n    setCompetitors([...competitors, { \n      name: newCompetitor, \n      website: `${newCompetitor.toLowerCase().replace(/\\s+/g, '-')}.com`, \n      socialMedia: { twitter: "", facebook: "" }, \n      seo: { keywords: [], backlinks: 0 } \n    }]);\n    setNewCompetitor("");\n  };\n\n  return (\n    <div className="flex h-screen bg-gray-50">\n      <Sidebar />\n      <div className="flex-1 flex flex-col overflow-hidden">\n        <Header />\n        <main className="flex-1 overflow-y-auto p-6">\n          <div className="max-w-7xl mx-auto space-y-6">\n            <Card>\n              <CardHeader>\n                <CardTitle>Competitor Analytics</CardTitle>\n                <CardDescription>Track and analyze your competitors' marketing activities.</CardDescription>\n              </CardHeader>\n              <CardContent className="space-y-4">\n                <div className="flex space-x-2">\n                  <Input \n                    value={newCompetitor}\n                    onChange={(e) => setNewCompetitor(e.target.value)}\n                    placeholder="Enter competitor name"\n                  />\n                  <Button onClick={handleAddCompetitor}>Add Competitor</Button>\n                </div>\n\n                <Table>\n                  <TableHeader>\n                    <TableRow>\n                      <TableHead>Competitor</TableHead>\n                      <TableHead>Website</_TableHead>\n                      <TableHead>Twitter</TableHead>\n                      <TableHead>Facebook</TableHead>\n                      <TableHead>Top Keywords</TableHead>\n                      <TableHead>Backlinks</TableHead>\n                    </TableRow>\n                  </TableHeader>\n                  <TableBody>\n                    {competitors.map((competitor, index) => (\n                      <TableRow key={index}>\n                        <TableCell>{competitor.name}</TableCell>\n                        <TableCell>{competitor.website}</TableCell>\n                        <TableCell>{competitor.socialMedia.twitter}</TableCell>\n                        <TableCell>{competitor.socialMedia.facebook}</TableCell>\n                        <TableCell>{competitor.seo.keywords.join(", ")}</TableCell>\n                        <TableCell>{competitor.seo.backlinks}</TableCell>\n                      </TableRow>\n                    ))}\n                  </TableBody>\n                </Table>\n\n              </CardContent>\n            </Card>\n          </div>\n        </main>\n      </div>\n    </div>\n  )\n}\n) in /home/sophiemabel78/Harmony_Marketing_Hub/app/competitor-analytics/page.tsx. No edits made. The exact text in old_string was not found. Ensure you're not escaping content incorrectly and check whitespace, indentation, and context. Use read_file tool to verify.</p>
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
