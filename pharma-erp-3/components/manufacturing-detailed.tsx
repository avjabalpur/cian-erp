"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, Eye, FileText, Play, Pause, CheckCircle, Settings } from "lucide-react"

export default function ManufacturingDetailed() {
  const [activeForm, setActiveForm] = useState<string | null>(null)

  const productionOrders = [
    {
      id: "MO-2024-001",
      product: "Paracetamol 500mg Tablets",
      batchSize: 100000,
      status: "In Progress",
      progress: 65,
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      priority: "High",
    },
    {
      id: "MO-2024-002",
      product: "Amoxicillin 250mg Capsules",
      batchSize: 50000,
      status: "Planned",
      progress: 0,
      startDate: "2024-01-18",
      endDate: "2024-01-25",
      priority: "Medium",
    },
    {
      id: "MO-2024-003",
      product: "Cough Syrup 100ml",
      batchSize: 25000,
      status: "Completed",
      progress: 100,
      startDate: "2024-01-10",
      endDate: "2024-01-15",
      priority: "Low",
    },
  ]

  const workOrders = [
    {
      id: "WO-2024-001",
      operation: "Granulation",
      moNumber: "MO-2024-001",
      workCenter: "Granulation Line 1",
      status: "In Progress",
      operator: "John Smith",
      startTime: "08:00",
      estimatedEnd: "12:00",
    },
    {
      id: "WO-2024-002",
      operation: "Compression",
      moNumber: "MO-2024-001",
      workCenter: "Tablet Press 3",
      status: "Waiting",
      operator: "Sarah Johnson",
      startTime: "13:00",
      estimatedEnd: "17:00",
    },
    {
      id: "WO-2024-003",
      operation: "Coating",
      moNumber: "MO-2024-001",
      workCenter: "Coating Pan 2",
      status: "Planned",
      operator: "Mike Wilson",
      startTime: "18:00",
      estimatedEnd: "22:00",
    },
  ]

  const batchRecords = [
    {
      id: "BR-2024-001",
      batchNumber: "B240115001",
      product: "Paracetamol 500mg",
      moNumber: "MO-2024-001",
      status: "Active",
      qcStatus: "In Progress",
      yield: 98.5,
      startDate: "2024-01-15",
    },
    {
      id: "BR-2024-002",
      batchNumber: "B240114001",
      product: "Cough Syrup 100ml",
      moNumber: "MO-2024-003",
      status: "Completed",
      qcStatus: "Approved",
      yield: 99.2,
      startDate: "2024-01-14",
    },
    {
      id: "BR-2024-003",
      batchNumber: "B240113001",
      product: "Amoxicillin 250mg",
      moNumber: "MO-2024-002",
      status: "Planned",
      qcStatus: "Pending",
      yield: 0,
      startDate: "2024-01-18",
    },
  ]

  const batchOperations = [
    {
      id: "BO-2024-001",
      batchNumber: "B240115001",
      operation: "Weighing",
      status: "Completed",
      operator: "John Smith",
      startTime: "08:00",
      endTime: "09:30",
      yield: 100,
      qcCheck: "Pass",
    },
    {
      id: "BO-2024-002",
      batchNumber: "B240115001",
      operation: "Mixing",
      status: "Completed",
      operator: "Sarah Johnson",
      startTime: "09:30",
      endTime: "11:00",
      yield: 99.8,
      qcCheck: "Pass",
    },
    {
      id: "BO-2024-003",
      batchNumber: "B240115001",
      operation: "Granulation",
      status: "In Progress",
      operator: "Mike Wilson",
      startTime: "11:00",
      endTime: "",
      yield: 0,
      qcCheck: "Pending",
    },
  ]

  const productionReceipts = [
    {
      id: "PR-2024-001",
      batchNumber: "B240114001",
      product: "Cough Syrup 100ml",
      quantityProduced: 24800,
      quantityApproved: 24800,
      warehouseLocation: "FG-A-001",
      receiptDate: "2024-01-15",
    },
    {
      id: "PR-2024-002",
      batchNumber: "B240113001",
      product: "Paracetamol 500mg",
      quantityProduced: 99500,
      quantityApproved: 99000,
      warehouseLocation: "FG-B-002",
      receiptDate: "2024-01-14",
    },
  ]

  const productionIssues = [
    {
      id: "PI-2024-001",
      batchNumber: "B240115001",
      material: "Paracetamol API",
      quantityIssued: 50.5,
      uom: "KG",
      issuedTo: "Production Line 1",
      issuedBy: "Store Keeper",
      issueDate: "2024-01-15",
    },
    {
      id: "PI-2024-002",
      batchNumber: "B240115001",
      material: "Microcrystalline Cellulose",
      quantityIssued: 25.2,
      uom: "KG",
      issuedTo: "Production Line 1",
      issuedBy: "Store Keeper",
      issueDate: "2024-01-15",
    },
  ]

  const equipmentLogs = [
    {
      id: "EL-2024-001",
      equipment: "Tablet Press 3",
      operation: "Compression",
      batchNumber: "B240115001",
      status: "Running",
      temperature: "25°C",
      pressure: "15 KN",
      speed: "45000 tph",
      operator: "John Smith",
    },
    {
      id: "EL-2024-002",
      equipment: "Granulation Line 1",
      operation: "Granulation",
      batchNumber: "B240115001",
      status: "Running",
      temperature: "60°C",
      pressure: "N/A",
      speed: "120 rpm",
      operator: "Sarah Johnson",
    },
  ]

  const campaignRecords = [
    {
      id: "CR-2024-001",
      campaign: "Paracetamol Campaign Jan 2024",
      product: "Paracetamol 500mg",
      plannedBatches: 10,
      completedBatches: 6,
      status: "In Progress",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
    },
    {
      id: "CR-2024-002",
      campaign: "Antibiotic Campaign Dec 2023",
      product: "Amoxicillin 250mg",
      plannedBatches: 8,
      completedBatches: 8,
      status: "Completed",
      startDate: "2023-12-01",
      endDate: "2023-12-31",
    },
  ]

  const renderProductionOrderForm = () => (
    <div className="space-y-4 max-w-6xl">
      <div className="grid grid-cols-6 gap-3">
        <div>
          <Label className="text-xs font-medium">MO Number</Label>
          <Input className="h-8 text-xs" placeholder="Auto-generated" disabled />
        </div>
        <div>
          <Label className="text-xs font-medium">Product</Label>
          <Select>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paracetamol">Paracetamol 500mg Tablets</SelectItem>
              <SelectItem value="amoxicillin">Amoxicillin 250mg Capsules</SelectItem>
              <SelectItem value="cough">Cough Syrup 100ml</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">Batch Size</Label>
          <Input className="h-8 text-xs" placeholder="100000" />
        </div>
        <div>
          <Label className="text-xs font-medium">Priority</Label>
          <Select>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">Start Date</Label>
          <Input type="date" className="h-8 text-xs" />
        </div>
        <div>
          <Label className="text-xs font-medium">End Date</Label>
          <Input type="date" className="h-8 text-xs" />
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-sm mb-3">Bill of Materials</h4>
        <div className="grid grid-cols-8 gap-2 text-xs font-medium mb-2">
          <div className="col-span-2">Material</div>
          <div>Required Qty</div>
          <div>UOM</div>
          <div>Available Stock</div>
          <div>Shortage</div>
          <div>Cost per Unit</div>
          <div>Total Cost</div>
        </div>
        <div className="space-y-1">
          <div className="grid grid-cols-8 gap-2 text-xs">
            <div className="col-span-2">Paracetamol API</div>
            <div>50.5</div>
            <div>KG</div>
            <div>125.0</div>
            <div className="text-green-600">0</div>
            <div>₹2,500</div>
            <div>₹1,26,250</div>
          </div>
          <div className="grid grid-cols-8 gap-2 text-xs">
            <div className="col-span-2">Microcrystalline Cellulose</div>
            <div>25.2</div>
            <div>KG</div>
            <div>15.0</div>
            <div className="text-red-600">10.2</div>
            <div>₹180</div>
            <div>₹4,536</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" className="h-8 text-xs">
          Create MO
        </Button>
        <Button size="sm" className="h-8 text-xs">
          Save Draft
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs bg-transparent" onClick={() => setActiveForm(null)}>
          Cancel
        </Button>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <Tabs defaultValue="production-orders" className="w-full">
        <TabsList className="grid w-full grid-cols-8 max-w-6xl mb-6">
          <TabsTrigger value="production-orders">Production Orders</TabsTrigger>
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          <TabsTrigger value="batch-records">Batch Records</TabsTrigger>
          <TabsTrigger value="batch-operations">Batch Operations</TabsTrigger>
          <TabsTrigger value="receipts">Production Receipt</TabsTrigger>
          <TabsTrigger value="issues">Production Issue</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Log</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Records</TabsTrigger>
        </TabsList>

        <TabsContent value="production-orders">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Production Orders</h2>
              <Button size="sm" onClick={() => setActiveForm("mo")} className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Production Order
              </Button>
            </div>

            {activeForm === "mo" ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Create Production Order</CardTitle>
                </CardHeader>
                <CardContent>{renderProductionOrderForm()}</CardContent>
              </Card>
            ) : (
              <div className="border rounded-lg">
                <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                  <div className="col-span-2">MO Number</div>
                  <div className="col-span-3">Product</div>
                  <div>Batch Size</div>
                  <div>Status</div>
                  <div>Progress</div>
                  <div>Start Date</div>
                  <div>End Date</div>
                  <div className="col-span-2">Actions</div>
                </div>
                {productionOrders.map((mo) => (
                  <div key={mo.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                    <div className="col-span-2 font-medium">{mo.id}</div>
                    <div className="col-span-3">{mo.product}</div>
                    <div>{mo.batchSize.toLocaleString()}</div>
                    <div>
                      <Badge
                        variant={
                          mo.status === "Completed" ? "default" : mo.status === "In Progress" ? "outline" : "secondary"
                        }
                        className="text-xs"
                      >
                        {mo.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={mo.progress} className="h-2 flex-1" />
                      <span className="text-xs">{mo.progress}%</span>
                    </div>
                    <div>{mo.startDate}</div>
                    <div>{mo.endDate}</div>
                    <div className="col-span-2 flex gap-1">
                      <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="work-orders">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Work Orders</h2>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Work Order
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                <div className="col-span-2">WO Number</div>
                <div className="col-span-2">Operation</div>
                <div>MO Number</div>
                <div className="col-span-2">Work Center</div>
                <div>Status</div>
                <div>Operator</div>
                <div>Start Time</div>
                <div>Est. End</div>
                <div className="col-span-2">Actions</div>
              </div>
              {workOrders.map((wo) => (
                <div key={wo.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                  <div className="col-span-2 font-medium">{wo.id}</div>
                  <div className="col-span-2">{wo.operation}</div>
                  <div>{wo.moNumber}</div>
                  <div className="col-span-2">{wo.workCenter}</div>
                  <div>
                    <Badge
                      variant={
                        wo.status === "In Progress" ? "default" : wo.status === "Waiting" ? "outline" : "secondary"
                      }
                      className="text-xs"
                    >
                      {wo.status}
                    </Badge>
                  </div>
                  <div>{wo.operator}</div>
                  <div>{wo.startTime}</div>
                  <div>{wo.estimatedEnd}</div>
                  <div className="col-span-2 flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Pause className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="batch-records">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Batch Records</h2>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Batch Record
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                <div className="col-span-2">BR Number</div>
                <div className="col-span-2">Batch Number</div>
                <div className="col-span-2">Product</div>
                <div>MO Number</div>
                <div>Status</div>
                <div>QC Status</div>
                <div>Yield %</div>
                <div>Start Date</div>
                <div className="col-span-2">Actions</div>
              </div>
              {batchRecords.map((br) => (
                <div key={br.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                  <div className="col-span-2 font-medium">{br.id}</div>
                  <div className="col-span-2">{br.batchNumber}</div>
                  <div className="col-span-2">{br.product}</div>
                  <div>{br.moNumber}</div>
                  <div>
                    <Badge
                      variant={br.status === "Completed" ? "default" : br.status === "Active" ? "outline" : "secondary"}
                      className="text-xs"
                    >
                      {br.status}
                    </Badge>
                  </div>
                  <div>
                    <Badge
                      variant={
                        br.qcStatus === "Approved" ? "default" : br.qcStatus === "In Progress" ? "outline" : "secondary"
                      }
                      className="text-xs"
                    >
                      {br.qcStatus}
                    </Badge>
                  </div>
                  <div>{br.yield}%</div>
                  <div>{br.startDate}</div>
                  <div className="col-span-2 flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <FileText className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="batch-operations">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Batch Operations</h2>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                <div className="col-span-2">BO Number</div>
                <div className="col-span-2">Batch Number</div>
                <div>Operation</div>
                <div>Status</div>
                <div>Operator</div>
                <div>Start Time</div>
                <div>End Time</div>
                <div>Yield %</div>
                <div>QC Check</div>
                <div className="col-span-2">Actions</div>
              </div>
              {batchOperations.map((bo) => (
                <div key={bo.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                  <div className="col-span-2 font-medium">{bo.id}</div>
                  <div className="col-span-2">{bo.batchNumber}</div>
                  <div>{bo.operation}</div>
                  <div>
                    <Badge variant={bo.status === "Completed" ? "default" : "outline"} className="text-xs">
                      {bo.status}
                    </Badge>
                  </div>
                  <div>{bo.operator}</div>
                  <div>{bo.startTime}</div>
                  <div>{bo.endTime || "-"}</div>
                  <div>{bo.yield}%</div>
                  <div>
                    <Badge variant={bo.qcCheck === "Pass" ? "default" : "secondary"} className="text-xs">
                      {bo.qcCheck}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="receipts">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Production Receipts</h2>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Receipt
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                <div className="col-span-2">PR Number</div>
                <div className="col-span-2">Batch Number</div>
                <div className="col-span-2">Product</div>
                <div>Qty Produced</div>
                <div>Qty Approved</div>
                <div className="col-span-2">Warehouse Location</div>
                <div>Receipt Date</div>
                <div className="col-span-2">Actions</div>
              </div>
              {productionReceipts.map((pr) => (
                <div key={pr.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                  <div className="col-span-2 font-medium">{pr.id}</div>
                  <div className="col-span-2">{pr.batchNumber}</div>
                  <div className="col-span-2">{pr.product}</div>
                  <div>{pr.quantityProduced.toLocaleString()}</div>
                  <div>{pr.quantityApproved.toLocaleString()}</div>
                  <div className="col-span-2">{pr.warehouseLocation}</div>
                  <div>{pr.receiptDate}</div>
                  <div className="col-span-2 flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <FileText className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="issues">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Production Issues</h2>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Issue
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                <div className="col-span-2">PI Number</div>
                <div className="col-span-2">Batch Number</div>
                <div className="col-span-2">Material</div>
                <div>Qty Issued</div>
                <div>UOM</div>
                <div className="col-span-2">Issued To</div>
                <div>Issued By</div>
                <div>Issue Date</div>
                <div>Actions</div>
              </div>
              {productionIssues.map((pi) => (
                <div key={pi.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                  <div className="col-span-2 font-medium">{pi.id}</div>
                  <div className="col-span-2">{pi.batchNumber}</div>
                  <div className="col-span-2">{pi.material}</div>
                  <div>{pi.quantityIssued}</div>
                  <div>{pi.uom}</div>
                  <div className="col-span-2">{pi.issuedTo}</div>
                  <div>{pi.issuedBy}</div>
                  <div>{pi.issueDate}</div>
                  <div>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="equipment">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Equipment Logs</h2>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                <div className="col-span-2">EL Number</div>
                <div className="col-span-2">Equipment</div>
                <div>Operation</div>
                <div className="col-span-2">Batch Number</div>
                <div>Status</div>
                <div>Temperature</div>
                <div>Pressure</div>
                <div>Speed</div>
                <div>Operator</div>
                <div>Actions</div>
              </div>
              {equipmentLogs.map((el) => (
                <div key={el.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                  <div className="col-span-2 font-medium">{el.id}</div>
                  <div className="col-span-2">{el.equipment}</div>
                  <div>{el.operation}</div>
                  <div className="col-span-2">{el.batchNumber}</div>
                  <div>
                    <Badge variant={el.status === "Running" ? "default" : "secondary"} className="text-xs">
                      {el.status}
                    </Badge>
                  </div>
                  <div>{el.temperature}</div>
                  <div>{el.pressure}</div>
                  <div>{el.speed}</div>
                  <div>{el.operator}</div>
                  <div>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Campaign Records</h2>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Campaign
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                <div className="col-span-2">CR Number</div>
                <div className="col-span-3">Campaign Name</div>
                <div className="col-span-2">Product</div>
                <div>Planned Batches</div>
                <div>Completed</div>
                <div>Status</div>
                <div>Start Date</div>
                <div>End Date</div>
                <div>Actions</div>
              </div>
              {campaignRecords.map((cr) => (
                <div key={cr.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                  <div className="col-span-2 font-medium">{cr.id}</div>
                  <div className="col-span-3">{cr.campaign}</div>
                  <div className="col-span-2">{cr.product}</div>
                  <div>{cr.plannedBatches}</div>
                  <div>{cr.completedBatches}</div>
                  <div>
                    <Badge variant={cr.status === "Completed" ? "default" : "outline"} className="text-xs">
                      {cr.status}
                    </Badge>
                  </div>
                  <div>{cr.startDate}</div>
                  <div>{cr.endDate}</div>
                  <div>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
