'''use client'''

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { TrendingUp, TrendingDown, Minus, Smile, Frown, Meh } from "lucide-react"

interface KeywordData {
  keyword: string;
  last_updated: string;
  positive_mentions: number;
  negative_mentions: number;
  neutral_mentions: number;
  sentiment_trend: 'positive' | 'negative' | 'stable';
}

export default function SocialListeningPage() {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/social-listening');
        if (!response.ok) {
          throw new Error('Failed to fetch social listening data');
        }
        const data = await response.json();
        setKeywords(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTrendIcon = (trend: KeywordData['sentiment_trend']) => {
    switch (trend) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'stable':
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Social Listening Dashboard</h1>

            {isLoading && <p>Loading keywords...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error && keywords.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>No Keywords Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>There are currently no keywords being monitored. New keywords will appear here once they are added.</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keywords.map((keyword) => (
                  <Card key={keyword.keyword}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{keyword.keyword}</CardTitle>
                        <div className="flex items-center space-x-1">
                            {getTrendIcon(keyword.sentiment_trend)}
                            <span className="text-sm font-medium">{keyword.sentiment_trend}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-around text-center">
                            <div className="flex items-center space-x-2">
                                <Smile className="h-6 w-6 text-green-500" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Positive</p>
                                    <p className="text-xl font-bold">{keyword.positive_mentions.toLocaleString()}</p>
                                </div>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Meh className="h-6 w-6 text-gray-500" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Neutral</p>
                                    <p className="text-xl font-bold">{keyword.neutral_mentions.toLocaleString()}</p>
                                </div>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Frown className="h-6 w-6 text-red-500" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Negative</p>
                                    <p className="text-xl font-bold">{keyword.negative_mentions.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center pt-2">Last updated: {new Date(keyword.last_updated).toLocaleString()}</p>
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
