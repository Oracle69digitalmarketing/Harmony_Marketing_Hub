'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function SettingsPage() {
  const { setTheme } = useTheme()
  const { data: session, status } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "")
      setEmail(session.user.email ?? "")
    }
  }, [session])

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        // Here you might want to show a toast notification for success.
        console.log("Profile saved successfully");
      } else {
        console.error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            
            {/* User Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Manage your name and email address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Theme Settings Section */}
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Select your preferred application theme.</CardDescription>
              </CardHeader>
              <CardContent className="flex space-x-2">
                <Button variant="outline" onClick={() => setTheme('light')}>Light</Button>
                <Button variant="outline" onClick={() => setTheme('dark')}>Dark</Button>
                <Button variant="outline" onClick={() => setTheme('system')}>System</Button>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  )
}