"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Download,
  Plus,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  Factory,
  Package,
  Beaker,
  Pill,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductionBatch {
  id: string
  batchNumber: string
  productName: string
  productType: "capsule" | "tablet" | "sachet" | "liquid"
  targetQuantity: number
  currentQuantity: number
  unit: string
  status: "planning" | "in-progress" | "qa-testing" | "completed" | "on-hold"
  startDate: string
  expectedCompletion: string
  actualCompletion?: string
  assignedLine: string
  priority: "low" | "medium" | "high" | "urgent"
  customerOrder: string
  rawMaterialsUsed: Array<{
    materialId: string
    materialName: string
    quantityUsed: number
    batchNumber: string
  }>
  qualityChecks: {
    passed: number
    total: number
  }
}

interface ProductionLine {
  id: string
  name: string
  type: "capsule" | "tablet" | "liquid" | "sachet"
  status: "active" | "maintenance" | "idle"
  currentBatch?: string
  capacity: number
  efficiency: number
  lastMaintenance: string
}

const mockProductionBatches: ProductionBatch[] = [
  {
    id: "PB001",
    batchNumber: "ACE-CAP-240815-001",
    productName: "Acetaminophen 500mg Capsules",
    productType: "capsule",
    targetQuantity: 100000,
    currentQuantity: 75000,
    unit: "units",
    status: "in-progress",
    startDate: "2024-12-05",
    expectedCompletion: "2024-12-12",
    assignedLine: "Capsule Line A",
    priority: "high",
    customerOrder: "ORD-HSP-001",
    rawMaterialsUsed: [
      { materialId: "RM001", materialName: "Acetaminophen USP", quantityUsed: 50, batchNumber: "AC240815001" },
      { materialId: "RM002", materialName: "Microcrystalline Cellulose", quantityUsed: 25, batchNumber: "MC240720002" },
    ],
    qualityChecks: { passed: 8, total: 10 },
  },
  {
    id: "PB002",
    batchNumber: "IBU-TAB-240810-002",
    productName: "Ibuprofen 200mg Tablets",
    productType: "tablet",
    targetQuantity: 50000,
    currentQuantity: 50000,
    unit: "units",
    status: "qa-testing",
    startDate: "2024-12-01",
    expectedCompletion: "2024-12-08",
    assignedLine: "Tablet Line B",
    priority: "medium",
    customerOrder: "ORD-RET-002",
    rawMaterialsUsed: [
      { materialId: "RM003", materialName: "Ibuprofen USP", quantityUsed: 10, batchNumber: "IB240810001" },
    ],
    qualityChecks: { passed: 12, total: 15 },
  },
  {
    id: "PB003",
    batchNumber: "VIT-SAC-240812-003",
    productName: "Vitamin C Powder Sachets",
    productType: "sachet",
    targetQuantity: 25000,
    currentQuantity: 0,
    unit: "sachets",
    status: "planning",
    startDate: "2024-12-15",
    expectedCompletion: "2024-12-20",
    assignedLine: "Sachet Line A",
    priority: "low",
    customerOrder: "ORD-DIS-003",
    rawMaterialsUsed: [],
    qualityChecks: { passed: 0, total: 8 },
  },
  {
    id: "PB004",
    batchNumber: "COD-LIQ-240814-004",
    productName: "Cough Syrup 120ml",
    productType: "liquid",
    targetQuantity: 10000,
    currentQuantity: 8500,
    unit: "bottles",
    status: "on-hold",
    startDate: "2024-12-03",
    expectedCompletion: "2024-12-10",
    assignedLine: "Liquid Line A",
    priority: "urgent",
    customerOrder: "ORD-HSP-004",
    rawMaterialsUsed: [
      { materialId: "RM005", materialName: "Dextromethorphan", quantityUsed: 2.5, batchNumber: "DX240814001" },
    ],
    qualityChecks: { passed: 5, total: 12 },
  },
]

const mockProductionLines: ProductionLine[] = [
  {
    id: "PL001",
    name: "Capsule Line A",
    type: "capsule",
    status: "active",
    currentBatch: "PB001",
    capacity: 15000,
    efficiency: 92,
    lastMaintenance: "2024-11-28",
  },
  {
    id: "PL002",
    name: "Tablet Line B",
    type: "tablet",
    status: "idle",
    capacity: 20000,
    efficiency: 88,
    lastMaintenance: "2024-12-01",
  },
  {
    id: "PL003",
    name: "Liquid Line A",
    type: "liquid",
    status: "maintenance",
    capacity: 5000,
    efficiency: 85,
    lastMaintenance: "2024-12-08",
  },
  {
    id: "PL004",
    name: "Sachet Line A",
    type: "sachet",
    status: "idle",
    capacity: 8000,
    efficiency: 90,
    lastMaintenance: "2024-11-25",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "planning":
      return <Clock className="h-4 w-4 text-blue-600" />
    case "in-progress":
      return <Play className="h-4 w-4 text-green-600" />
    case "qa-testing":
      return <Beaker className="h-4 w-4 text-orange-600" />
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "on-hold":
      return <Pause className="h-4 w-4 text-red-600" />
    default:
      return null
  }
}

const getStatusBadge = (status: string) => {
  const variants = {
    planning: "bg-blue-100 text-blue-800 border-blue-200",
    "in-progress": "bg-green-100 text-green-800 border-green-200",
    "qa-testing": "bg-orange-100 text-orange-800 border-orange-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    "on-hold": "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <Badge className={`${variants[status as keyof typeof variants]} text-xs font-medium`}>
      {status.replace("-", " ").toUpperCase()}
    </Badge>
  )
}

const getPriorityBadge = (priority: string) => {
  const variants = {
    low: "bg-gray-100 text-gray-800 border-gray-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <Badge className={`${variants[priority as keyof typeof variants]} text-xs font-medium`}>
      {priority.toUpperCase()}
    </Badge>
  )
}

const getProductTypeIcon = (type: string) => {
  switch (type) {
    case "capsule":
      return <Pill className="h-4 w-4 text-blue-600" />
    case "tablet":
      return <Package className="h-4 w-4 text-green-600" />
    case "liquid":
      return <Beaker className="h-4 w-4 text-purple-600" />
    case "sachet":
      return <Package className="h-4 w-4 text-orange-600" />
    default:
      return <Package className="h-4 w-4 text-gray-600" />
  }
}

const getLineStatusBadge = (status: string) => {
  const variants = {
    active: "bg-green-100 text-green-800 border-green-200",
    idle: "bg-gray-100 text-gray-800 border-gray-200",
    maintenance: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <Badge className={`${variants[status as keyof typeof variants]} text-xs font-medium`}>{status.toUpperCase()}</Badge>
  )
}

export function ProductionManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredBatches = mockProductionBatches.filter((batch) => {
    const matchesSearch =
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.customerOrder.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || batch.status === statusFilter
    const matchesType = typeFilter === "all" || batch.productType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="p-6 space-y-6 bg-green-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Production Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manufacturing operations and batch tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-green-700 hover:bg-green-800">
            <Plus className="h-4 w-4 mr-2" />
            New Batch
          </Button>
        </div>
      </div>

      <Tabs defaultValue="batches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="batches">Production Batches</TabsTrigger>
          <TabsTrigger value="lines">Production Lines</TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search batches, products, orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="qa-testing">QA Testing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="capsule">Capsules</SelectItem>
                    <SelectItem value="tablet">Tablets</SelectItem>
                    <SelectItem value="liquid">Liquids</SelectItem>
                    <SelectItem value="sachet">Sachets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Production Batches Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Production Batches ({filteredBatches.length} active)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Batch Info
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Timeline
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Quality
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBatches.map((batch, index) => {
                      const progress = (batch.currentQuantity / batch.targetQuantity) * 100
                      const qualityProgress = (batch.qualityChecks.passed / batch.qualityChecks.total) * 100

                      return (
                        <tr
                          key={batch.id}
                          className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        >
                          <td className="p-3">
                            <div>
                              <div className="font-medium text-sm text-gray-900 font-mono">{batch.batchNumber}</div>
                              <div className="text-xs text-gray-500">Line: {batch.assignedLine}</div>
                              <div className="text-xs text-gray-400">Order: {batch.customerOrder}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getProductTypeIcon(batch.productType)}
                              <div>
                                <div className="font-medium text-sm text-gray-900">{batch.productName}</div>
                                <div className="text-xs text-gray-500 capitalize">{batch.productType}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{batch.currentQuantity.toLocaleString()}</span>
                                <span>
                                  {batch.targetQuantity.toLocaleString()} {batch.unit}
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <div className="text-xs text-gray-500">{Math.round(progress)}% complete</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(batch.status)}
                                {getStatusBadge(batch.status)}
                              </div>
                              {getPriorityBadge(batch.priority)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="text-gray-900">Start: {batch.startDate}</div>
                              <div className="text-gray-600">Due: {batch.expectedCompletion}</div>
                              {batch.actualCompletion && (
                                <div className="text-green-600">Done: {batch.actualCompletion}</div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{batch.qualityChecks.passed}</span>
                                <span>{batch.qualityChecks.total} checks</span>
                              </div>
                              <Progress value={qualityProgress} className="h-2" />
                              <div className="text-xs text-gray-500">{Math.round(qualityProgress)}% passed</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Edit</span>
                                ✏️
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">View details</span>
                                👁️
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lines" className="space-y-6">
          {/* Production Lines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockProductionLines.map((line) => (
              <Card key={line.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{line.name}</CardTitle>
                    <Factory className="h-5 w-5 text-gray-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    {getLineStatusBadge(line.status)}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <div className="flex items-center gap-1">
                      {getProductTypeIcon(line.type)}
                      <span className="text-sm font-medium capitalize">{line.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Capacity</span>
                    <span className="text-sm font-medium">{line.capacity.toLocaleString()}/day</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Efficiency</span>
                      <span className="font-medium">{line.efficiency}%</span>
                    </div>
                    <Progress value={line.efficiency} className="h-2" />
                  </div>

                  {line.currentBatch && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Batch</span>
                      <span className="text-sm font-mono">{line.currentBatch}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Maintenance</span>
                    <span className="text-sm">{line.lastMaintenance}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Maintain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Active Batches</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockProductionBatches.filter((b) => b.status === "in-progress").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Play className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">QA Testing</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mockProductionBatches.filter((b) => b.status === "qa-testing").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Beaker className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">On Hold</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockProductionBatches.filter((b) => b.status === "on-hold").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Lines Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockProductionLines.filter((l) => l.status === "active").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Factory className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
