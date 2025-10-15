"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Package, Truck, FileText, RotateCcw } from "lucide-react"

export default function SalesDistribution() {
  const [activeView, setActiveView] = useState("list")
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Sample data for different transaction types
  const salesOrders = [
    {
      id: "SO-2024-001",
      customer: "Apollo Hospitals",
      date: "2024-01-15",
      amount: 125000,
      status: "Confirmed",
      items: 5,
    },
    { id: "SO-2024-002", customer: "Max Healthcare", date: "2024-01-16", amount: 89500, status: "Pending", items: 3 },
    {
      id: "SO-2024-003",
      customer: "Fortis Healthcare",
      date: "2024-01-17",
      amount: 156000,
      status: "Shipped",
      items: 7,
    },
  ]

  const salesInvoices = [
    {
      id: "INV-2024-001",
      order: "SO-2024-001",
      customer: "Apollo Hospitals",
      date: "2024-01-20",
      amount: 125000,
      status: "Paid",
      dueDate: "2024-02-20",
    },
    {
      id: "INV-2024-002",
      order: "SO-2024-003",
      customer: "Fortis Healthcare",
      date: "2024-01-22",
      amount: 156000,
      status: "Outstanding",
      dueDate: "2024-02-22",
    },
  ]

  const deliveryNotes = [
    {
      id: "DN-2024-001",
      order: "SO-2024-001",
      customer: "Apollo Hospitals",
      date: "2024-01-18",
      status: "Delivered",
      driver: "Rajesh Kumar",
      vehicle: "MH-12-AB-1234",
    },
    {
      id: "DN-2024-002",
      order: "SO-2024-003",
      customer: "Fortis Healthcare",
      date: "2024-01-19",
      status: "In Transit",
      driver: "Suresh Patel",
      vehicle: "MH-12-CD-5678",
    },
  ]

  const salesReturns = [
    {
      id: "SR-2024-001",
      invoice: "INV-2024-001",
      customer: "Apollo Hospitals",
      date: "2024-01-25",
      amount: 12500,
      reason: "Damaged Packaging",
      status: "Approved",
    },
  ]

  const SalesOrderForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-8 gap-2 text-xs">
        <div>
          <Label>Order No</Label>
          <Input placeholder="Auto-generated" className="h-8" />
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" className="h-8" />
        </div>
        <div>
          <Label>Customer</Label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apollo">Apollo Hospitals</SelectItem>
              <SelectItem value="max">Max Healthcare</SelectItem>
              <SelectItem value="fortis">Fortis Healthcare</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Priority</Label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Normal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Payment Terms</Label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Net 30" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="net15">Net 15</SelectItem>
              <SelectItem value="net30">Net 30</SelectItem>
              <SelectItem value="net45">Net 45</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Delivery Date</Label>
          <Input type="date" className="h-8" />
        </div>
        <div>
          <Label>Sales Rep</Label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rep1">Amit Sharma</SelectItem>
              <SelectItem value="rep2">Priya Patel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Currency</Label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="INR" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inr">INR</SelectItem>
              <SelectItem value="usd">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="bg-gray-50 p-2 border-b">
          <h4 className="font-medium text-sm">Order Lines</h4>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-12 gap-1 text-xs font-medium mb-2">
            <div className="col-span-3">Item Code / Description</div>
            <div>Batch</div>
            <div>Qty</div>
            <div>UOM</div>
            <div>Rate</div>
            <div>Disc%</div>
            <div>Tax%</div>
            <div>Amount</div>
            <div>Actions</div>
          </div>
          {[1, 2, 3].map((line) => (
            <div key={line} className="grid grid-cols-12 gap-1 text-xs mb-2">
              <div className="col-span-3">
                <Select>
                  <SelectTrigger className="h-7">
                    <SelectValue placeholder="Select Item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paracetamol">Paracetamol 500mg</SelectItem>
                    <SelectItem value="amoxicillin">Amoxicillin 250mg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input placeholder="Batch" className="h-7" />
              </div>
              <div>
                <Input placeholder="0" className="h-7" />
              </div>
              <div>
                <Select>
                  <SelectTrigger className="h-7">
                    <SelectValue placeholder="PCS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">PCS</SelectItem>
                    <SelectItem value="box">BOX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input placeholder="0.00" className="h-7" />
              </div>
              <div>
                <Input placeholder="0" className="h-7" />
              </div>
              <div>
                <Input placeholder="18" className="h-7" />
              </div>
              <div>
                <Input placeholder="0.00" className="h-7" readOnly />
              </div>
              <div>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" className="mt-2 bg-transparent">
            <Plus className="h-3 w-3 mr-1" />
            Add Line
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label>Shipping Address</Label>
          <Textarea placeholder="Enter shipping address" className="h-20 text-xs" />
        </div>
        <div>
          <Label>Billing Address</Label>
          <Textarea placeholder="Enter billing address" className="h-20 text-xs" />
        </div>
        <div>
          <Label>Special Instructions</Label>
          <Textarea placeholder="Any special instructions" className="h-20 text-xs" />
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Label>Subtotal:</Label>
            <span className="text-right">₹0.00</span>
            <Label>Discount:</Label>
            <span className="text-right">₹0.00</span>
            <Label>Tax:</Label>
            <span className="text-right">₹0.00</span>
            <Label className="font-bold">Total:</Label>
            <span className="text-right font-bold">₹0.00</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm">Save Order</Button>
        <Button size="sm" variant="outline">
          Save & Print
        </Button>
        <Button size="sm" variant="outline">
          Save & Email
        </Button>
        <Button size="sm" variant="secondary">
          Cancel
        </Button>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Sales & Distribution</h2>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setActiveView("new")}>
            <Plus className="h-4 w-4 mr-1" />
            New Transaction
          </Button>
        </div>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-6 max-w-3xl">
          <TabsTrigger value="orders">Sales Orders</TabsTrigger>
          <TabsTrigger value="invoices">Sales Invoices</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Notes</TabsTrigger>
          <TabsTrigger value="returns">Sales Returns</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4">
          {activeView === "new" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">New Sales Order</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesOrderForm />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Search orders..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-lg">
                <div className="grid grid-cols-8 gap-4 p-3 bg-gray-50 border-b text-sm font-medium">
                  <div>Order No</div>
                  <div>Customer</div>
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Items</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {salesOrders.map((order) => (
                  <div key={order.id} className="grid grid-cols-8 gap-4 p-3 border-b text-sm hover:bg-gray-50">
                    <div className="font-medium">{order.id}</div>
                    <div>{order.customer}</div>
                    <div>{order.date}</div>
                    <div>₹{order.amount.toLocaleString()}</div>
                    <div>{order.items}</div>
                    <div>
                      <Badge
                        variant={
                          order.status === "Confirmed"
                            ? "default"
                            : order.status === "Pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <FileText className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Package className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Search invoices..." className="max-w-sm" />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="outstanding">Outstanding</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-8 gap-4 p-3 bg-gray-50 border-b text-sm font-medium">
                <div>Invoice No</div>
                <div>Order Ref</div>
                <div>Customer</div>
                <div>Date</div>
                <div>Due Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              {salesInvoices.map((invoice) => (
                <div key={invoice.id} className="grid grid-cols-8 gap-4 p-3 border-b text-sm hover:bg-gray-50">
                  <div className="font-medium">{invoice.id}</div>
                  <div>{invoice.order}</div>
                  <div>{invoice.customer}</div>
                  <div>{invoice.date}</div>
                  <div>{invoice.dueDate}</div>
                  <div>₹{invoice.amount.toLocaleString()}</div>
                  <div>
                    <Badge variant={invoice.status === "Paid" ? "default" : "destructive"}>{invoice.status}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="mt-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Search delivery notes..." className="max-w-sm" />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="transit">In Transit</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-8 gap-4 p-3 bg-gray-50 border-b text-sm font-medium">
                <div>DN No</div>
                <div>Order Ref</div>
                <div>Customer</div>
                <div>Date</div>
                <div>Driver</div>
                <div>Vehicle</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              {deliveryNotes.map((dn) => (
                <div key={dn.id} className="grid grid-cols-8 gap-4 p-3 border-b text-sm hover:bg-gray-50">
                  <div className="font-medium">{dn.id}</div>
                  <div>{dn.order}</div>
                  <div>{dn.customer}</div>
                  <div>{dn.date}</div>
                  <div>{dn.driver}</div>
                  <div>{dn.vehicle}</div>
                  <div>
                    <Badge variant={dn.status === "Delivered" ? "default" : "secondary"}>{dn.status}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <Truck className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="returns" className="mt-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Search returns..." className="max-w-sm" />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-8 gap-4 p-3 bg-gray-50 border-b text-sm font-medium">
                <div>Return No</div>
                <div>Invoice Ref</div>
                <div>Customer</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Reason</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              {salesReturns.map((ret) => (
                <div key={ret.id} className="grid grid-cols-8 gap-4 p-3 border-b text-sm hover:bg-gray-50">
                  <div className="font-medium">{ret.id}</div>
                  <div>{ret.invoice}</div>
                  <div>{ret.customer}</div>
                  <div>{ret.date}</div>
                  <div>₹{ret.amount.toLocaleString()}</div>
                  <div>{ret.reason}</div>
                  <div>
                    <Badge variant="default">{ret.status}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="mt-4">
          <div className="text-center py-8 text-muted-foreground">Customer Shipment Management - Coming Soon</div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹2.4M</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">-5% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Return Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.1%</div>
                <p className="text-xs text-muted-foreground">-0.3% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
