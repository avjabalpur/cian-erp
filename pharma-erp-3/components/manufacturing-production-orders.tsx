"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  Edit,
  Eye,
  Filter,
  Download,
  Upload,
  Play,
  Pause,
  Square,
  AlertTriangle,
  CheckCircle,
  Clock,
  Factory,
} from "lucide-react"

interface ProductionOperation {
  id: string
  operationNo: string
  operationName: string
  workCenter: string
  setupTime: number
  runTime: number
  queueTime: number
  status: string
  startDate: string
  endDate: string
  actualStartDate?: string
  actualEndDate?: string
  operator: string
  equipment: string
  yield: number
  scrapQty: number
  qcRequired: boolean
  qcStatus?: string
}

interface MaterialConsumption {
  id: string
  itemCode: string
  itemName: string
  batchNo: string
  plannedQty: number
  consumedQty: number
  uom: string
  warehouse: string
  lotNo: string
  expiryDate: string
  qcStatus: string
}

interface ProductionOrder {
  id: string
  orderNo: string
  productCode: string
  productName: string
  batchNo: string
  plannedQty: number
  producedQty: number
  uom: string
  priority: string
  status: string
  orderDate: string
  plannedStartDate: string
  plannedEndDate: string
  actualStartDate?: string
  actualEndDate?: string
  formulaVersion: string
  routingVersion: string
  workCenter: string
  supervisor: string
  shift: string
  campaignNo: string
  operations: ProductionOperation[]
  materials: MaterialConsumption[]
  yieldPercentage: number
  scrapPercentage: number
  costCenter: string
  glAccount: string
}

const mockProductionOrders: ProductionOrder[] = [
  {
    id: "1",
    orderNo: "MO-2024-001",
    productCode: "CAP001",
    productName: "Paracetamol 500mg Capsules",
    batchNo: "B240115001",
    plannedQty: 100000,
    producedQty: 75000,
    uom: "PCS",
    priority: "High",
    status: "In Progress",
    orderDate: "2024-01-15",
    plannedStartDate: "2024-01-16",
    plannedEndDate: "2024-01-20",
    actualStartDate: "2024-01-16",
    formulaVersion: "F001-V2.1",
    routingVersion: "R001-V1.3",
    workCenter: "WC-CAP-01",
    supervisor: "John Smith",
    shift: "A",
    campaignNo: "CAM-2024-001",
    yieldPercentage: 98.5,
    scrapPercentage: 1.5,
    costCenter: "CC-MFG-001",
    glAccount: "GL-WIP-001",
    operations: [
      {
        id: "1",
        operationNo: "010",
        operationName: "Weighing & Dispensing",
        workCenter: "WC-WGH-01",
        setupTime: 30,
        runTime: 120,
        queueTime: 15,
        status: "Completed",
        startDate: "2024-01-16 08:00",
        endDate: "2024-01-16 10:30",
        actualStartDate: "2024-01-16 08:15",
        actualEndDate: "2024-01-16 10:45",
        operator: "Mike Johnson",
        equipment: "EQ-WGH-001",
        yield: 99.2,
        scrapQty: 0.8,
        qcRequired: true,
        qcStatus: "Passed",
      },
      {
        id: "2",
        operationNo: "020",
        operationName: "Blending",
        workCenter: "WC-BLD-01",
        setupTime: 45,
        runTime: 180,
        queueTime: 30,
        status: "In Progress",
        startDate: "2024-01-16 11:00",
        endDate: "2024-01-16 14:45",
        actualStartDate: "2024-01-16 11:15",
        operator: "Sarah Wilson",
        equipment: "EQ-BLD-001",
        yield: 98.8,
        scrapQty: 1.2,
        qcRequired: true,
      },
      {
        id: "3",
        operationNo: "030",
        operationName: "Encapsulation",
        workCenter: "WC-CAP-01",
        setupTime: 60,
        runTime: 240,
        queueTime: 20,
        status: "Pending",
        startDate: "2024-01-16 15:00",
        endDate: "2024-01-16 19:00",
        operator: "David Brown",
        equipment: "EQ-CAP-001",
        yield: 0,
        scrapQty: 0,
        qcRequired: true,
      },
    ],
    materials: [
      {
        id: "1",
        itemCode: "RM001",
        itemName: "Paracetamol API",
        batchNo: "B240110001",
        plannedQty: 50,
        consumedQty: 49.8,
        uom: "KG",
        warehouse: "WH-RM-01",
        lotNo: "LOT-240110-001",
        expiryDate: "2026-01-10",
        qcStatus: "Passed",
      },
      {
        id: "2",
        itemCode: "RM002",
        itemName: "Microcrystalline Cellulose",
        batchNo: "B240112001",
        plannedQty: 25,
        consumedQty: 24.9,
        uom: "KG",
        warehouse: "WH-RM-01",
        lotNo: "LOT-240112-001",
        expiryDate: "2025-12-12",
        qcStatus: "Passed",
      },
      {
        id: "3",
        itemCode: "PM001",
        itemName: "Hard Gelatin Capsules Size 0",
        batchNo: "B240114001",
        plannedQty: 100000,
        consumedQty: 75000,
        uom: "PCS",
        warehouse: "WH-PM-01",
        lotNo: "LOT-240114-001",
        expiryDate: "2025-06-14",
        qcStatus: "Passed",
      },
    ],
  },
  {
    id: "2",
    orderNo: "MO-2024-002",
    productCode: "TAB002",
    productName: "Aspirin 75mg Tablets",
    batchNo: "B240116001",
    plannedQty: 50000,
    producedQty: 0,
    uom: "PCS",
    priority: "Medium",
    status: "Released",
    orderDate: "2024-01-16",
    plannedStartDate: "2024-01-18",
    plannedEndDate: "2024-01-22",
    formulaVersion: "F002-V1.5",
    routingVersion: "R002-V1.2",
    workCenter: "WC-TAB-01",
    supervisor: "Lisa Davis",
    shift: "B",
    campaignNo: "CAM-2024-002",
    yieldPercentage: 0,
    scrapPercentage: 0,
    costCenter: "CC-MFG-002",
    glAccount: "GL-WIP-002",
    operations: [],
    materials: [],
  },
]

export default function ManufacturingProductionOrders() {
  const [activeTab, setActiveTab] = useState("list")
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredOrders = mockProductionOrders.filter((order) => {
    const matchesSearch =
      order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-3 h-3 text-green-600" />
      case "In Progress":
        return <Play className="w-3 h-3 text-blue-600" />
      case "Pending":
        return <Clock className="w-3 h-3 text-orange-600" />
      case "On Hold":
        return <Pause className="w-3 h-3 text-yellow-600" />
      case "Cancelled":
        return <Square className="w-3 h-3 text-red-600" />
      default:
        return <AlertTriangle className="w-3 h-3 text-gray-600" />
    }
  }

  const ProductionOrderForm = ({ order, isEdit = false }: { order?: ProductionOrder; isEdit?: boolean }) => (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded">
        <div>
          <label className="text-xs font-medium text-gray-600">Order No</label>
          <Input className="h-8" defaultValue={order?.orderNo} placeholder="Auto-generated" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Product Code</label>
          <Select defaultValue={order?.productCode}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CAP001">CAP001 - Paracetamol 500mg</SelectItem>
              <SelectItem value="TAB002">TAB002 - Aspirin 75mg</SelectItem>
              <SelectItem value="SYR003">SYR003 - Cough Syrup</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Batch No</label>
          <Input className="h-8" defaultValue={order?.batchNo} placeholder="Auto-generated" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Planned Qty</label>
          <Input type="number" className="h-8" defaultValue={order?.plannedQty} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">UOM</label>
          <Select defaultValue={order?.uom || "PCS"}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PCS">PCS</SelectItem>
              <SelectItem value="KG">KG</SelectItem>
              <SelectItem value="LTR">LTR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Priority</label>
          <Select defaultValue={order?.priority || "Medium"}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Work Center</label>
          <Select defaultValue={order?.workCenter}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WC-CAP-01">WC-CAP-01</SelectItem>
              <SelectItem value="WC-TAB-01">WC-TAB-01</SelectItem>
              <SelectItem value="WC-LIQ-01">WC-LIQ-01</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Supervisor</label>
          <Select defaultValue={order?.supervisor}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="John Smith">John Smith</SelectItem>
              <SelectItem value="Lisa Davis">Lisa Davis</SelectItem>
              <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dates and Formula Section */}
      <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded">
        <div>
          <label className="text-xs font-medium text-gray-600">Order Date</label>
          <Input type="date" className="h-8" defaultValue={order?.orderDate} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Planned Start</label>
          <Input type="date" className="h-8" defaultValue={order?.plannedStartDate} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Planned End</label>
          <Input type="date" className="h-8" defaultValue={order?.plannedEndDate} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Formula Version</label>
          <Select defaultValue={order?.formulaVersion}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="F001-V2.1">F001-V2.1</SelectItem>
              <SelectItem value="F002-V1.5">F002-V1.5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Routing Version</label>
          <Select defaultValue={order?.routingVersion}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="R001-V1.3">R001-V1.3</SelectItem>
              <SelectItem value="R002-V1.2">R002-V1.2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Shift</label>
          <Select defaultValue={order?.shift}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A Shift</SelectItem>
              <SelectItem value="B">B Shift</SelectItem>
              <SelectItem value="C">C Shift</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Campaign No</label>
          <Input className="h-8" defaultValue={order?.campaignNo} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Cost Center</label>
          <Select defaultValue={order?.costCenter}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CC-MFG-001">CC-MFG-001</SelectItem>
              <SelectItem value="CC-MFG-002">CC-MFG-002</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Operations Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Production Operations</h3>
          <Button size="sm" className="h-7">
            <Plus className="w-3 h-3 mr-1" />
            Add Operation
          </Button>
        </div>

        <div className="border rounded">
          <div className="grid grid-cols-12 gap-1 p-2 bg-gray-50 text-xs font-medium border-b">
            <div>Op No</div>
            <div className="col-span-2">Operation Name</div>
            <div>Work Center</div>
            <div>Setup (min)</div>
            <div>Run (min)</div>
            <div>Status</div>
            <div>Operator</div>
            <div>Equipment</div>
            <div>Yield %</div>
            <div>QC Status</div>
            <div>Actions</div>
          </div>

          {(order?.operations || []).map((operation) => (
            <div key={operation.id} className="grid grid-cols-12 gap-1 p-2 text-xs border-b hover:bg-gray-50">
              <div className="font-medium">{operation.operationNo}</div>
              <div className="col-span-2">{operation.operationName}</div>
              <div>{operation.workCenter}</div>
              <div>{operation.setupTime}</div>
              <div>{operation.runTime}</div>
              <div className="flex items-center gap-1">
                {getStatusIcon(operation.status)}
                <span>{operation.status}</span>
              </div>
              <div>{operation.operator}</div>
              <div>{operation.equipment}</div>
              <div>{operation.yield}%</div>
              <Badge variant={operation.qcStatus === "Passed" ? "default" : "secondary"} className="text-xs">
                {operation.qcStatus || "Pending"}
              </Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Material Consumption Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Material Consumption</h3>
          <Button size="sm" className="h-7">
            <Plus className="w-3 h-3 mr-1" />
            Add Material
          </Button>
        </div>

        <div className="border rounded">
          <div className="grid grid-cols-12 gap-1 p-2 bg-gray-50 text-xs font-medium border-b">
            <div>Item Code</div>
            <div className="col-span-2">Item Name</div>
            <div>Batch No</div>
            <div>Planned Qty</div>
            <div>Consumed Qty</div>
            <div>UOM</div>
            <div>Warehouse</div>
            <div>Lot No</div>
            <div>Expiry Date</div>
            <div>QC Status</div>
            <div>Actions</div>
          </div>

          {(order?.materials || []).map((material) => (
            <div key={material.id} className="grid grid-cols-12 gap-1 p-2 text-xs border-b hover:bg-gray-50">
              <div className="font-medium text-blue-600">{material.itemCode}</div>
              <div className="col-span-2">{material.itemName}</div>
              <div>{material.batchNo}</div>
              <div>{material.plannedQty}</div>
              <div className="font-medium">{material.consumedQty}</div>
              <div>{material.uom}</div>
              <div>{material.warehouse}</div>
              <div>{material.lotNo}</div>
              <div>{material.expiryDate}</div>
              <Badge variant={material.qcStatus === "Passed" ? "default" : "secondary"} className="text-xs">
                {material.qcStatus}
              </Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={() => setActiveTab("list")}>
          Cancel
        </Button>
        <Button variant="outline">Save Draft</Button>
        <Button>Save & Release</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-auto grid-cols-3">
            <TabsTrigger value="list">Production Orders</TabsTrigger>
            <TabsTrigger value="create">Create Order</TabsTrigger>
            <TabsTrigger value="edit">Edit Order</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Released">Released</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="h-8" placeholder="From Date" />
            <Input type="date" className="h-8" placeholder="To Date" />
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Work Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WC-CAP-01">WC-CAP-01</SelectItem>
                <SelectItem value="WC-TAB-01">WC-TAB-01</SelectItem>
                <SelectItem value="WC-LIQ-01">WC-LIQ-01</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="h-8">
              <Filter className="w-4 h-4 mr-1" />
              Apply
            </Button>
            <Button size="sm" variant="outline" className="h-8 bg-transparent">
              <Factory className="w-4 h-4 mr-1" />
              Schedule
            </Button>
          </div>

          {/* Production Orders Table */}
          <div className="border rounded">
            <div className="grid grid-cols-14 gap-1 p-2 bg-gray-50 text-xs font-medium border-b">
              <div>Order No</div>
              <div className="col-span-2">Product</div>
              <div>Batch No</div>
              <div>Planned Qty</div>
              <div>Produced Qty</div>
              <div>Progress</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Start Date</div>
              <div>End Date</div>
              <div>Work Center</div>
              <div>Supervisor</div>
              <div>Actions</div>
            </div>

            {filteredOrders.map((order) => {
              const progress = (order.producedQty / order.plannedQty) * 100
              return (
                <div key={order.id} className="grid grid-cols-14 gap-1 p-2 text-xs border-b hover:bg-gray-50">
                  <div className="font-medium text-blue-600">{order.orderNo}</div>
                  <div className="col-span-2">
                    <div className="font-medium">{order.productCode}</div>
                    <div className="text-gray-600">{order.productName}</div>
                  </div>
                  <div className="font-medium">{order.batchNo}</div>
                  <div>{order.plannedQty.toLocaleString()}</div>
                  <div className="font-medium">{order.producedQty.toLocaleString()}</div>
                  <div className="space-y-1">
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-center">{progress.toFixed(1)}%</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    <Badge
                      variant={
                        order.status === "Completed"
                          ? "default"
                          : order.status === "In Progress"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <Badge
                    variant={
                      order.priority === "High" || order.priority === "Critical"
                        ? "destructive"
                        : order.priority === "Medium"
                          ? "default"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {order.priority}
                  </Badge>
                  <div>{order.plannedStartDate}</div>
                  <div>{order.plannedEndDate}</div>
                  <div>{order.workCenter}</div>
                  <div>{order.supervisor}</div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setSelectedOrder(order)
                        setActiveTab("edit")
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Orders</div>
                <div className="text-lg font-bold">{filteredOrders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">In Progress</div>
                <div className="text-lg font-bold text-blue-600">
                  {filteredOrders.filter((o) => o.status === "In Progress").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Completed</div>
                <div className="text-lg font-bold text-green-600">
                  {filteredOrders.filter((o) => o.status === "Completed").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">High Priority</div>
                <div className="text-lg font-bold text-red-600">
                  {filteredOrders.filter((o) => o.priority === "High" || o.priority === "Critical").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Avg Yield</div>
                <div className="text-lg font-bold">
                  {(filteredOrders.reduce((sum, o) => sum + o.yieldPercentage, 0) / filteredOrders.length).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Production</div>
                <div className="text-lg font-bold">
                  {filteredOrders.reduce((sum, o) => sum + o.producedQty, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Production Order</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductionOrderForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Production Order: {selectedOrder?.orderNo}</CardTitle>
            </CardHeader>
            <CardContent>{selectedOrder && <ProductionOrderForm order={selectedOrder} isEdit={true} />}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
