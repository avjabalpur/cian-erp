"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, DollarSign, TrendingUp, BarChart3, PieChart } from "lucide-react"

export default function FinancialAnalytics() {
  const [activeTab, setActiveTab] = useState("financial-management")

  const financialData = [
    {
      id: "FIN001",
      account: "Raw Materials",
      type: "Expense",
      amount: "$2,450,000",
      budget: "$2,500,000",
      variance: "-2%",
      period: "Q1 2024",
      status: "On Track",
    },
    {
      id: "FIN002",
      account: "Manufacturing Overhead",
      type: "Expense",
      amount: "$1,850,000",
      budget: "$1,800,000",
      variance: "+2.8%",
      period: "Q1 2024",
      status: "Over Budget",
    },
    {
      id: "FIN003",
      account: "Product Sales Revenue",
      type: "Revenue",
      amount: "$8,750,000",
      budget: "$8,500,000",
      variance: "+2.9%",
      period: "Q1 2024",
      status: "Exceeding",
    },
  ]

  const costAnalysis = [
    {
      product: "Analgesic Tablet 500mg",
      batchSize: "100,000 units",
      materialCost: "$45,000",
      laborCost: "$12,000",
      overheadCost: "$8,500",
      totalCost: "$65,500",
      unitCost: "$0.655",
      sellingPrice: "$0.95",
      margin: "45.0%",
    },
    {
      product: "Antibiotic Suspension 250ml",
      batchSize: "50,000 units",
      materialCost: "$78,000",
      laborCost: "$18,000",
      overheadCost: "$15,200",
      totalCost: "$111,200",
      unitCost: "$2.224",
      sellingPrice: "$3.20",
      margin: "30.5%",
    },
    {
      product: "Cardiovascular Capsule 25mg",
      batchSize: "200,000 units",
      materialCost: "$125,000",
      laborCost: "$22,000",
      overheadCost: "$18,800",
      totalCost: "$165,800",
      unitCost: "$0.829",
      sellingPrice: "$1.35",
      margin: "38.6%",
    },
  ]

  const budgetForecasting = [
    {
      category: "R&D Investment",
      q1Actual: "$1,250,000",
      q2Forecast: "$1,400,000",
      q3Forecast: "$1,350,000",
      q4Forecast: "$1,500,000",
      yearTotal: "$5,500,000",
      variance: "+8.5%",
    },
    {
      category: "Manufacturing Costs",
      q1Actual: "$4,850,000",
      q2Forecast: "$5,100,000",
      q3Forecast: "$5,200,000",
      q4Forecast: "$5,400,000",
      yearTotal: "$20,550,000",
      variance: "+3.2%",
    },
    {
      category: "Regulatory Compliance",
      q1Actual: "$450,000",
      q2Forecast: "$500,000",
      q3Forecast: "$480,000",
      q4Forecast: "$520,000",
      yearTotal: "$1,950,000",
      variance: "+12.8%",
    },
  ]

  const businessIntelligence = [
    { metric: "Revenue Growth Rate", value: "15.2%", trend: "up", benchmark: "12.0%", status: "Above Target" },
    { metric: "Manufacturing Efficiency", value: "94.5%", trend: "up", benchmark: "92.0%", status: "Exceeding" },
    { metric: "Quality Cost Ratio", value: "2.8%", trend: "down", benchmark: "3.5%", status: "Excellent" },
    { metric: "Inventory Turnover", value: "8.2x", trend: "up", benchmark: "7.5x", status: "Above Target" },
    { metric: "Customer Satisfaction", value: "96.8%", trend: "stable", benchmark: "95.0%", status: "Exceeding" },
    { metric: "Regulatory Compliance Score", value: "99.2%", trend: "up", benchmark: "98.0%", status: "Excellent" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-emerald-800">Financial Management & Analytics</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search financial data..." className="pl-8 w-64" />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-1" />
            New Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial-management">Financial Management</TabsTrigger>
          <TabsTrigger value="cost-analysis">Cost Analysis</TabsTrigger>
          <TabsTrigger value="budget-forecasting">Budget & Forecasting</TabsTrigger>
          <TabsTrigger value="business-intelligence">Business Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="financial-management">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Management Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Account ID</th>
                      <th className="text-left p-2 font-medium">Account</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Actual Amount</th>
                      <th className="text-left p-2 font-medium">Budget</th>
                      <th className="text-left p-2 font-medium">Variance</th>
                      <th className="text-left p-2 font-medium">Period</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{item.id}</td>
                        <td className="p-2 font-medium">{item.account}</td>
                        <td className="p-2">{item.type}</td>
                        <td className="p-2 font-medium">{item.amount}</td>
                        <td className="p-2">{item.budget}</td>
                        <td className="p-2">
                          <span
                            className={`font-medium ${item.variance.startsWith("+") ? "text-red-600" : "text-green-600"}`}
                          >
                            {item.variance}
                          </span>
                        </td>
                        <td className="p-2">{item.period}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              item.status === "Exceeding"
                                ? "default"
                                : item.status === "On Track"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost-analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Product Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">Batch Size</th>
                      <th className="text-left p-2 font-medium">Material Cost</th>
                      <th className="text-left p-2 font-medium">Labor Cost</th>
                      <th className="text-left p-2 font-medium">Overhead Cost</th>
                      <th className="text-left p-2 font-medium">Total Cost</th>
                      <th className="text-left p-2 font-medium">Unit Cost</th>
                      <th className="text-left p-2 font-medium">Selling Price</th>
                      <th className="text-left p-2 font-medium">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costAnalysis.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{item.product}</td>
                        <td className="p-2">{item.batchSize}</td>
                        <td className="p-2 font-medium">{item.materialCost}</td>
                        <td className="p-2">{item.laborCost}</td>
                        <td className="p-2">{item.overheadCost}</td>
                        <td className="p-2 font-bold">{item.totalCost}</td>
                        <td className="p-2 font-medium">{item.unitCost}</td>
                        <td className="p-2">{item.sellingPrice}</td>
                        <td className="p-2">
                          <Badge variant="default" className="text-xs">
                            {item.margin}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget-forecasting">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Budget & Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-left p-2 font-medium">Q1 Actual</th>
                      <th className="text-left p-2 font-medium">Q2 Forecast</th>
                      <th className="text-left p-2 font-medium">Q3 Forecast</th>
                      <th className="text-left p-2 font-medium">Q4 Forecast</th>
                      <th className="text-left p-2 font-medium">Year Total</th>
                      <th className="text-left p-2 font-medium">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetForecasting.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{item.category}</td>
                        <td className="p-2 font-bold">{item.q1Actual}</td>
                        <td className="p-2">{item.q2Forecast}</td>
                        <td className="p-2">{item.q3Forecast}</td>
                        <td className="p-2">{item.q4Forecast}</td>
                        <td className="p-2 font-bold">{item.yearTotal}</td>
                        <td className="p-2">
                          <span
                            className={`font-medium ${item.variance.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                          >
                            {item.variance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business-intelligence">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Business Intelligence Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {businessIntelligence.map((metric, index) => (
                  <Card key={index} className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{metric.metric}</p>
                          <p className="text-2xl font-bold text-emerald-800">{metric.value}</p>
                          <p className="text-xs text-gray-500">Benchmark: {metric.benchmark}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              metric.status === "Excellent" || metric.status === "Exceeding" ? "default" : "secondary"
                            }
                            className="text-xs mb-2"
                          >
                            {metric.status}
                          </Badge>
                          <div
                            className={`text-sm ${metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-gray-600"}`}
                          >
                            {metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→"} {metric.trend}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
