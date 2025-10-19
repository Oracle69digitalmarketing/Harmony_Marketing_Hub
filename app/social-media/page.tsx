'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Loader, Facebook, Twitter, Linkedin } from "lucide-react"

export default function SocialMediaPage() {
  const [postContent, setPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const handleAccountToggle = (account: string) => {
    setSelectedAccounts(prev => 
      prev.includes(account) 
        ? prev.filter(a => a !== account) 
        : [...prev, account]
    );
  };

  const handlePost = async () => {
    if (!postContent || selectedAccounts.length === 0) return;

    setIsPosting(true);
    setError(null);

    try {
      // This is where you would call the API to post to social media
      console.log("Posting to social media:", { postContent, selectedAccounts });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setPostContent("");
      setSelectedAccounts([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPosting(false);
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
                <CardTitle>Social Media Content Marketing</CardTitle>
                <CardDescription>Create and publish content to your social media accounts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <Button 
                      variant={selectedAccounts.includes('facebook') ? 'default' : 'outline'}
                      onClick={() => handleAccountToggle('facebook')}
                    >
                      <Facebook className="mr-2 h-4 w-4" /> Facebook
                    </Button>
                    <Button 
                      variant={selectedAccounts.includes('twitter') ? 'default' : 'outline'}
                      onClick={() => handleAccountToggle('twitter')}
                    >
                      <Twitter className="mr-2 h-4 w-4" /> Twitter
                    </Button>
                    <Button 
                      variant={selectedAccounts.includes('linkedin') ? 'default' : 'outline'}
                      onClick={() => handleAccountToggle('linkedin')}
                    >
                      <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                    </Button>
                  </div>
                  <Textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="mb-2"
                  />
                  <Button onClick={handlePost} disabled={isPosting || !postContent || selectedAccounts.length === 0}>
                    {isPosting ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Posting...</> : "Post to Selected Accounts"}
                  </Button>
                </div>

                {error && (
                  <div className="p-4 border rounded-lg bg-red-50 text-red-700">
                    <h3 className="text-lg font-semibold mb-2">An Error Occurred</h3>
                    <p>{error}</p>
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
