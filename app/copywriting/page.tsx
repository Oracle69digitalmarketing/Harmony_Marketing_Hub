'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Loader } from "lucide-react"

export default function CopywritingPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCopy = async () => {
    if (!prompt) return;

    setIsLoading(true);
    setError(null);
    setGeneratedCopy("");

    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An unknown error occurred.');
      }

      const data = await response.json();
      setGeneratedCopy(data.copy);
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
                <CardTitle>AI Copywriting Assistant</CardTitle>
                <CardDescription>Generate compelling marketing copy for your campaigns.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Write a catchy headline for a new line of sustainable sneakers.'"
                    className="mb-2"
                  />
                  <Button onClick={handleGenerateCopy} disabled={isLoading || !prompt}>
                    {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Copy"}
                  </Button>
                </div>

                {error && (
                  <div className="p-4 border rounded-lg bg-red-50 text-red-700">
                    <h3 className="text-lg font-semibold mb-2">An Error Occurred</h3>
                    <p>{error}</p>
                  </div>
                )}

                {generatedCopy && (
                  <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                    <h3 className="text-xl font-bold mb-4">Generated Copy</h3>
                    <div className="space-y-4 whitespace-pre-wrap">{generatedCopy}</div>
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
