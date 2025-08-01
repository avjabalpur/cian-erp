"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Package, ShoppingCart, TrendingUp, TrendingDown } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard"

export function DashboardStats() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error loading stats</CardTitle>
            <CardDescription>Failed to load dashboard statistics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const statCards = [
    {
      name: "Total Customers",
      value: stats?.totalCustomers?.toString() || "0",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
    },
    {
      name: "Total Items",
      value: stats?.totalItems?.toString() || "0",
      change: "+5%",
      changeType: "positive" as const,
      icon: Package,
      color: "text-green-600",
    },
    {
      name: "Sales Orders",
      value: stats?.totalSalesOrders?.toString() || "0",
      change: "+18%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.changeType === "positive" ? (
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                {stat.change}
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 