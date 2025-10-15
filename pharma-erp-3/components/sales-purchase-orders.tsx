"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Eye, Trash2, Filter, Download, Upload } from "lucide-react"

interface OrderLine {
  id: string
  itemCode: string
  itemName: string
  batchNo: string
  qty: number
  uom: string
  unitPrice: number
  discount: number
  taxRate: number
  lineTotal: number
  deliveryDate: string
  warehouse: string
  qcRequired: boolean
}

interface Order {
  id: string
  orderNo: string
  type: "sales" | "purchase" | "quotation"
  customerVendor: string
  orderDate: string
  deliveryDate: string
  status: string
  priority: string
  totalAmount: number
  currency: string
  paymentTerms: string
  lines: OrderLine[]
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNo: "SO-2024-001",
    type: "sales",
    customerVendor: "Apollo Hospitals",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-25",
    status: "Confirmed",
    priority: "High",
    totalAmount: 125000,
    currency: "USD",
    paymentTerms: "Net 30",
    lines: [
      {
        id: "1",
        itemCode: "CAP001",
        itemName: "Paracetamol 500mg Capsules",
        batchNo: "B240115",
        qty: 10000,
        uom: "PCS",
        unitPrice: 0.05,
        discount: 2,
        taxRate: 18,
        lineTotal: 5900,
        deliveryDate: "2024-01-25",
        warehouse: "WH-FG-01",
        qcRequired: true,
      },
      {
        id: "2",
        itemCode: "TAB002",
        itemName: "Aspirin 75mg Tablets",
        batchNo: "B240116",
        qty: 5000,
        uom: "PCS",
        unitPrice: 0.08,
        discount: 0,
        taxRate: 18,
        lineTotal: 4720,
        deliveryDate: "2024-01-25",
        warehouse: "WH-FG-01",
        qcRequired: true,
      },
    ],
  },
  {
    id: "2",
    orderNo: "PO-2024-001",
    type: "purchase",
    customerVendor: "Sigma Pharmaceuticals",
    orderDate: "2024-01-16",
    deliveryDate: "2024-01-30",
    status: "Pending Approval",
    priority: "Medium",
    totalAmount: 85000,
    currency: "USD",
    paymentTerms: "Net 45",
    lines: [
      {
        id: "1",
        itemCode: "RM001",
        itemName: "Paracetamol API",
        batchNo: "",
        qty: 500,
        uom: "KG",
        unitPrice: 45,
        discount: 5,
        taxRate: 18,
        lineTotal: 26775,
        deliveryDate: "2024-01-30",
        warehouse: "WH-RM-01",
        qcRequired: true,
      },
    ],
  },
]

export default function SalesPurchaseOrders() {
  const [activeTab, setActiveTab] = useState("list")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderType, setOrderType] = useState("sales")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerVendor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesType = orderType === "all" || order.type === orderType
    return matchesSearch && matchesStatus && matchesType
  })

  const OrderForm = ({ order, isEdit = false }: { order?: Order; isEdit?: boolean }) => (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded">
        <div>
          <label className="text-xs font-medium text-gray-600">Order Type</label>
          <Select defaultValue={order?.type || "sales"}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Order</SelectItem>
              <SelectItem value="purchase">Purchase Order</SelectItem>
              <SelectItem value="quotation">Quotation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Order No</label>
          <Input className="h-8" defaultValue={order?.orderNo} placeholder="Auto-generated" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Customer/Vendor</label>
          <Select defaultValue={order?.customerVendor}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apollo Hospitals">Apollo Hospitals</SelectItem>
              <SelectItem value="Sigma Pharmaceuticals">Sigma Pharmaceuticals</SelectItem>
              <SelectItem value="Max Healthcare">Max Healthcare</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Order Date</label>
          <Input type="date" className="h-8" defaultValue={order?.orderDate} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Delivery Date</label>
          <Input type="date" className="h-8" defaultValue={order?.deliveryDate} />
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
          <label className="text-xs font-medium text-gray-600">Currency</label>
          <Select defaultValue={order?.currency || "USD"}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="INR">INR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Payment Terms</label>
          <Select defaultValue={order?.paymentTerms || "Net 30"}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Net 15">Net 15</SelectItem>
              <SelectItem value="Net 30">Net 30</SelectItem>
              <SelectItem value="Net 45">Net 45</SelectItem>
              <SelectItem value="COD">COD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Order Lines Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Order Lines</h3>
          <Button size="sm" className="h-7">
            <Plus className="w-3 h-3 mr-1" />
            Add Line
          </Button>
        </div>

        <div className="border rounded">
          <div className="grid grid-cols-12 gap-1 p-2 bg-gray-50 text-xs font-medium border-b">
            <div>Item Code</div>
            <div className="col-span-2">Item Name</div>
            <div>Batch No</div>
            <div>Qty</div>
            <div>UOM</div>
            <div>Unit Price</div>
            <div>Disc%</div>
            <div>Tax%</div>
            <div>Line Total</div>
            <div>Warehouse</div>
            <div>Actions</div>
          </div>

          {(order?.lines || []).map((line, index) => (
            <div key={line.id} className="grid grid-cols-12 gap-1 p-2 text-xs border-b hover:bg-gray-50">
              <Input className="h-7" defaultValue={line.itemCode} />
              <Input className="h-7 col-span-2" defaultValue={line.itemName} />
              <Input className="h-7" defaultValue={line.batchNo} />
              <Input className="h-7" type="number" defaultValue={line.qty} />
              <Select defaultValue={line.uom}>
                <SelectTrigger className="h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PCS">PCS</SelectItem>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="LTR">LTR</SelectItem>
                </SelectContent>
              </Select>
              <Input className="h-7" type="number" step="0.01" defaultValue={line.unitPrice} />
              <Input className="h-7" type="number" defaultValue={line.discount} />
              <Input className="h-7" type="number" defaultValue={line.taxRate} />
              <div className="flex items-center font-medium">${line.lineTotal.toLocaleString()}</div>
              <Select defaultValue={line.warehouse}>
                <SelectTrigger className="h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WH-FG-01">WH-FG-01</SelectItem>
                  <SelectItem value="WH-RM-01">WH-RM-01</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Section */}
        <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded">
          <div className="text-right">
            <div className="text-xs text-gray-600">Subtotal</div>
            <div className="font-medium">${(order?.totalAmount || 0 * 0.85).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">Discount</div>
            <div className="font-medium">-${(order?.totalAmount || 0 * 0.05).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">Tax</div>
            <div className="font-medium">${(order?.totalAmount || 0 * 0.18).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">Total Amount</div>
            <div className="text-lg font-bold">${(order?.totalAmount || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={() => setActiveTab("list")}>
          Cancel
        </Button>
        <Button variant="outline">Save Draft</Button>
        <Button>Save & Submit</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-auto grid-cols-3">
            <TabsTrigger value="list">Order List</TabsTrigger>
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
          <div className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sales">Sales Orders</SelectItem>
                <SelectItem value="purchase">Purchase Orders</SelectItem>
                <SelectItem value="quotation">Quotations</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="h-8" placeholder="From Date" />
            <Input type="date" className="h-8" placeholder="To Date" />
            <Button size="sm" className="h-8">
              <Filter className="w-4 h-4 mr-1" />
              Apply
            </Button>
          </div>

          {/* Orders Table */}
          <div className="border rounded">
            <div className="grid grid-cols-12 gap-2 p-2 bg-gray-50 text-xs font-medium border-b">
              <div>Order No</div>
              <div>Type</div>
              <div className="col-span-2">Customer/Vendor</div>
              <div>Order Date</div>
              <div>Delivery Date</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Amount</div>
              <div>Currency</div>
              <div>Lines</div>
              <div>Actions</div>
            </div>

            {filteredOrders.map((order) => (
              <div key={order.id} className="grid grid-cols-12 gap-2 p-2 text-xs border-b hover:bg-gray-50">
                <div className="font-medium text-blue-600">{order.orderNo}</div>
                <Badge
                  variant={order.type === "sales" ? "default" : order.type === "purchase" ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {order.type.toUpperCase()}
                </Badge>
                <div className="col-span-2">{order.customerVendor}</div>
                <div>{order.orderDate}</div>
                <div>{order.deliveryDate}</div>
                <Badge variant={order.status === "Confirmed" ? "default" : "secondary"} className="text-xs">
                  {order.status}
                </Badge>
                <Badge
                  variant={
                    order.priority === "High" ? "destructive" : order.priority === "Medium" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {order.priority}
                </Badge>
                <div className="font-medium">${order.totalAmount.toLocaleString()}</div>
                <div>{order.currency}</div>
                <div>{order.lines.length} lines</div>
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
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
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
                <div className="text-xs text-gray-600">Sales Orders</div>
                <div className="text-lg font-bold">{filteredOrders.filter((o) => o.type === "sales").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Purchase Orders</div>
                <div className="text-lg font-bold">{filteredOrders.filter((o) => o.type === "purchase").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Pending Approval</div>
                <div className="text-lg font-bold text-orange-600">
                  {filteredOrders.filter((o) => o.status === "Pending Approval").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">High Priority</div>
                <div className="text-lg font-bold text-red-600">
                  {filteredOrders.filter((o) => o.priority === "High").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Value</div>
                <div className="text-lg font-bold">
                  ${filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Order</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Order: {selectedOrder?.orderNo}</CardTitle>
            </CardHeader>
            <CardContent>{selectedOrder && <OrderForm order={selectedOrder} isEdit={true} />}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
