'''use client'''

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function AttributionPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attribution Modeling</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This page is under construction. Marketing attribution modeling and analysis features will be available here.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
