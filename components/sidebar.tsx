"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Brain,
  DollarSign,
  Shield,
  Target,
  Users,
  Settings,
  Home,
  TrendingUp,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { useSession } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "AI Scenario Runner", href: "/scenario-runner", icon: Brain },
  { name: "Campaigns", href: "/campaigns", icon: Target },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "A/B Testing", href: "/ab-testing", icon: FileText },
  { name: "Social Listening", href: "/social-listening", icon: MessageSquare },
  { name: "Customer Journey", href: "/customer-journey", icon: Users },
  { name: "Attribution", href: "/attribution", icon: TrendingUp },
  { name: "Budget Optimizer", href: "/budget", icon: DollarSign },
  { name: "Compliance", href: "/compliance", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O69</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Oracle69</h1>
              <p className="text-xs text-gray-500">Marketing Hub</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-1">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "px-2" : "px-3",
                    isActive && "bg-blue-600 text-white hover:bg-blue-700",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            )
          })}
          {session?.user?.role === 'admin' && (
            <Link href="/admin">
              <Button
                variant={pathname === '/admin' ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed ? "px-2" : "px-3",
                  pathname === '/admin' && "bg-blue-600 text-white hover:bg-blue-700",
                )}
              >
                <Shield className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                {!collapsed && <span>Admin</span>}
              </Button>
            </Link>
          )}
        </nav>
      </ScrollArea>
    </div>
  )
}
