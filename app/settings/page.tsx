'use client'

import { useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function SettingsPage() {
  const { setTheme } = useTheme()
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@oracle69.com")

  const handleSaveProfile = () => {
    // In a real application, you would call an API to save the user's profile.
    // For this prototype, we'll just log it to the console.
    console.log("Saving profile:", { name, email });
    // Here you might want to show a toast notification for success.
  };

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