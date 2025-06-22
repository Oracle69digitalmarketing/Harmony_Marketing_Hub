"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Plus, Search, Filter, MoreHorizontal, Play, Pause, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const campaigns = [
  {
    id: 1,
    name: "Q1 Product Launch Campaign",
    status: "active",
    type: "Multi-channel",
    budget: 45000,
    spent: 32100,
    impressions: 2847392,
    clicks: 18493,
    conversions: 847,
    roi: 287,
    startDate: "2024-01-15",
    endDate: "2024-03-31",
    channels: ["Google Ads", "Facebook", "LinkedIn", "Email"],
  },
  {
    id: 2,
    name: "Brand Awareness Spring",
    status: "optimizing",
    type: "Display",
    budget: 28500,
    spent: 19200,
    impressions: 1923847,
    clicks: 12847,
    conversions: 423,
    roi: 156,
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    channels: ["Google Display", "Facebook", "Instagram"],
  },
  {
    id: 3,
    name: "Holiday Promotion 2024",
    status: "paused",
    type: "Seasonal",
    budget: 15000,
    spent: 8900,
    impressions: 847392,
    clicks: 5847,
    conversions: 234,
    roi: 203,
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    channels: ["Email", "Social Media"],
  },
  {
    id: 4,
    name: "Lead Generation B2B",
    status: "active",
    type: "Lead Gen",
    budget: 35000,
    spent: 28400,
    impressions: 1547392,
    clicks: 9847,
    conversions: 567,
    roi: 234,
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    channels: ["LinkedIn", "Google Ads", "Content Marketing"],
  },
]

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === "all" || campaign.status === activeTab),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-gray-100 text-gray-800"
      case "optimizing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
                <p className="text-gray-600 mt-1">Monitor, optimize, and scale your marketing campaigns</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Campaigns</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="paused">Paused</TabsTrigger>
                <TabsTrigger value="optimizing">Optimizing</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <CardTitle className="text-lg">{campaign.name}</CardTitle>
                            <CardDescription className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{campaign.type}</Badge>
                              <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                              <span className="text-sm text-gray-500">
                                {campaign.startDate} - {campaign.endDate}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {campaign.status === "active" ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause Campaign
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Resume Campaign
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">${campaign.budget.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Budget</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">${campaign.spent.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Spent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{campaign.roi}%</div>
                          <div className="text-sm text-gray-500">ROI</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{campaign.impressions.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Impressions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{campaign.clicks.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{campaign.conversions}</div>
                          <div className="text-sm text-gray-500">Conversions</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget Progress</span>
                          <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                        </div>
                        <Progress value={(campaign.spent / campaign.budget) * 100} />
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-wrap gap-1">
                          {campaign.channels.map((channel, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
