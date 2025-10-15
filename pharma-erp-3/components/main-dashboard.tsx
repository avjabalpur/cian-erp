"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Package,
  Factory,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Shield,
} from "lucide-react"

interface DashboardMetric {
  title: string
  value: string | number
  change: number
  changeType: "increase" | "decrease"
  icon: React.ReactNode
  color: "green" | "blue" | "orange" | "red" | "gray"
}

interface AlertItem {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  timestamp: string
  module: "raw-materials" | "production" | "quality" | "customers"
}

const dashboardMetrics: DashboardMetric[] = [
  {
    title: "Active Production Batches",
    value: 12,
    change: 8.3,
    changeType: "increase",
    icon: <Factory className="h-5 w-5" />,
    color: "blue",
  },
  {
    title: "Raw Materials Low Stock",
    value: 3,
    change: -25.0,
    changeType: "decrease",
    icon: <Package className="h-5 w-5" />,
    color: "orange",
  },
  {
    title: "Quality Tests Pending",
    value: 8,
    change: 12.5,
    changeType: "increase",
    icon: <Shield className="h-5 w-5" />,
    color: "orange",
  },
  {
    title: "Orders This Month",
    value: 156,
    change: 15.2,
    changeType: "increase",
    icon: <Users className="h-5 w-5" />,
    color: "green",
  },
  {
    title: "Monthly Revenue",
    value: "$2.4M",
    change: 18.7,
    changeType: "increase",
    icon: <DollarSign className="h-5 w-5" />,
    color: "green",
  },
  {
    title: "Compliance Score",
    value: "94%",
    change: 2.1,
    changeType: "increase",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "green",
  },
]

const recentAlerts: AlertItem[] = [
  {
    id: "ALT001",
    type: "critical",
    title: "Quality Test Failed",
    description: "Cough Syrup batch COD-LIQ-240814-004 failed identity testing",
    timestamp: "2 hours ago",
    module: "quality",
  },
  {
    id: "ALT002",
    type: "warning",
    title: "Low Stock Alert",
    description: "Microcrystalline Cellulose inventory below minimum threshold",
    timestamp: "4 hours ago",
    module: "raw-materials",
  },
  {
    id: "ALT003",
    type: "warning",
    title: "Production Line Maintenance",
    description: "Liquid Line A scheduled for maintenance in 24 hours",
    timestamp: "6 hours ago",
    module: "production",
  },
  {
    id: "ALT004",
    type: "info",
    title: "Large Order Received",
    description: "New order from City General Hospital - $67,500 value",
    timestamp: "8 hours ago",
    module: "customers",
  },
  {
    id: "ALT005",
    type: "warning",
    title: "Compliance Deadline",
    description: "Temperature excursion CAPA due in 3 days",
    timestamp: "1 day ago",
    module: "quality",
  },
]

const productionSummary = {
  totalBatches: 24,
  activeBatches: 12,
  completedToday: 3,
  averageEfficiency: 89,
  capacityUtilization: 76,
}

const qualitySummary = {
  testsThisWeek: 45,
  passRate: 94.2,
  pendingTests: 8,
  criticalIssues: 1,
  complianceScore: 94,
}

const getMetricColor = (color: string) => {
  const colors = {
    green: "text-green-600 bg-green-100",
    blue: "text-blue-600 bg-blue-100",
    orange: "text-orange-600 bg-orange-100",
    red: "text-red-600 bg-red-100",
    gray: "text-gray-600 bg-gray-100",
  }
  return colors[color as keyof typeof colors]
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    case "warning":
      return <Clock className="h-4 w-4 text-orange-600" />
    case "info":
      return <Activity className="h-4 w-4 text-blue-600" />
    default:
      return <Activity className="h-4 w-4 text-gray-600" />
  }
}

const getAlertBadge = (type: string) => {
  const variants = {
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-orange-100 text-orange-800 border-orange-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  }

  return (
    <Badge className={`${variants[type as keyof typeof variants]} text-xs font-medium`}>{type.toUpperCase()}</Badge>
  )
}

export function MainDashboard() {
  return (
    <div className="p-6 space-y-6 bg-green-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharma Manufacturing Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Real-time operations overview and key performance indicators</p>
        </div>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {metric.changeType === "increase" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        metric.changeType === "increase" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change}%
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${getMetricColor(metric.color)}`}
                >
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-blue-600" />
              Production Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{productionSummary.totalBatches}</div>
                <div className="text-xs text-gray-600">Total Batches</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{productionSummary.activeBatches}</div>
                <div className="text-xs text-gray-600">Active Batches</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{productionSummary.completedToday}</div>
                <div className="text-xs text-gray-600">Completed Today</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{productionSummary.averageEfficiency}%</div>
                <div className="text-xs text-gray-600">Avg Efficiency</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Capacity Utilization</span>
                <span className="text-sm font-bold text-gray-900">{productionSummary.capacityUtilization}%</span>
              </div>
              <Progress value={productionSummary.capacityUtilization} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Production Lines Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Capsule Line A</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Tablet Line B</span>
                    <Badge className="bg-gray-100 text-gray-800 text-xs">Idle</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Liquid Line A</span>
                    <Badge className="bg-red-100 text-red-800 text-xs">Maintenance</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Recent Completions</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Ibuprofen 200mg Tablets - 50K units</div>
                  <div>Vitamin C Sachets - 25K sachets</div>
                  <div>Antibiotic Capsules - 75K units</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{alert.title}</h4>
                      {getAlertBadge(alert.type)}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {alert.module.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality & Compliance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Quality Control Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{qualitySummary.testsThisWeek}</div>
                <div className="text-xs text-gray-600">Tests This Week</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{qualitySummary.passRate}%</div>
                <div className="text-xs text-gray-600">Pass Rate</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Quality Pass Rate</span>
                <span className="text-sm font-bold text-gray-900">{qualitySummary.passRate}%</span>
              </div>
              <Progress value={qualitySummary.passRate} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Tests</span>
                <span className="text-sm font-semibold text-orange-600">{qualitySummary.pendingTests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Critical Issues</span>
                <span className="text-sm font-semibold text-red-600">{qualitySummary.criticalIssues}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Business Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">$2.4M</div>
                <div className="text-xs text-gray-600">Monthly Revenue</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">156</div>
                <div className="text-xs text-gray-600">Orders This Month</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Compliance Score</span>
                <span className="text-sm font-bold text-gray-900">{qualitySummary.complianceScore}%</span>
              </div>
              <Progress value={qualitySummary.complianceScore} className="h-3" />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Customers</span>
                <span className="font-semibold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Pending Payments</span>
                <span className="font-semibold text-orange-600">2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Avg Order Value</span>
                <span className="font-semibold text-gray-900">$15.4K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
