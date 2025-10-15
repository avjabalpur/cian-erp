"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Eye, FileText, Package, Receipt, RotateCcw } from "lucide-react"

export default function ProcurementModule() {
  const [activeForm, setActiveForm] = useState<string | null>(null)

  const purchaseRequisitions = [
    {
      id: "PR-2024-001",
      date: "2024-01-15",
      department: "Production",
      requestor: "John Smith",
      status: "Pending Approval",
      priority: "High",
      totalAmount: 125000,
      items: 5,
    },
    {
      id: "PR-2024-002",
      date: "2024-01-14",
      department: "QC Lab",
      requestor: "Sarah Johnson",
      status: "Approved",
      priority: "Medium",
      totalAmount: 45000,
      items: 3,
    },
    {
      id: "PR-2024-003",
      date: "2024-01-13",
      department: "Packaging",
      requestor: "Mike Wilson",
      status: "In Review",
      priority: "Low",
      totalAmount: 78000,
      items: 8,
    },
  ]

  const purchaseOrders = [
    {
      id: "PO-2024-001",
      date: "2024-01-15",
      vendor: "ChemSupply Ltd",
      status: "Open",
      totalAmount: 125000,
      deliveryDate: "2024-01-25",
      items: 5,
      received: 0,
    },
    {
      id: "PO-2024-002",
      date: "2024-01-14",
      vendor: "PharmaRaw Inc",
      status: "Partially Received",
      totalAmount: 89000,
      deliveryDate: "2024-01-22",
      items: 3,
      received: 1,
    },
    {
      id: "PO-2024-003",
      date: "2024-01-13",
      vendor: "BioMaterials Co",
      status: "Closed",
      totalAmount: 156000,
      deliveryDate: "2024-01-20",
      items: 7,
      received: 7,
    },
  ]

  const goodsReceipts = [
    {
      id: "GR-2024-001",
      date: "2024-01-15",
      poNumber: "PO-2024-002",
      vendor: "PharmaRaw Inc",
      receivedBy: "Warehouse Team",
      status: "Quality Check",
      items: 1,
      batchNumbers: ["B240115001"],
    },
    {
      id: "GR-2024-002",
      date: "2024-01-14",
      poNumber: "PO-2024-003",
      vendor: "BioMaterials Co",
      receivedBy: "QC Inspector",
      status: "Accepted",
      items: 7,
      batchNumbers: ["B240114001", "B240114002"],
    },
  ]

  const purchaseInvoices = [
    {
      id: "PI-2024-001",
      date: "2024-01-15",
      vendor: "ChemSupply Ltd",
      poNumber: "PO-2024-001",
      amount: 125000,
      dueDate: "2024-02-14",
      status: "Pending Payment",
      gstAmount: 22500,
    },
    {
      id: "PI-2024-002",
      date: "2024-01-14",
      vendor: "PharmaRaw Inc",
      poNumber: "PO-2024-002",
      amount: 89000,
      dueDate: "2024-02-13",
      status: "Paid",
      gstAmount: 16020,
    },
  ]

  const vendorReturns = [
    {
      id: "VR-2024-001",
      date: "2024-01-15",
      vendor: "BioMaterials Co",
      reason: "Quality Issue",
      status: "Pending Approval",
      returnValue: 15000,
      items: 2,
      batchNumbers: ["B240110001"],
    },
    {
      id: "VR-2024-002",
      date: "2024-01-14",
      vendor: "ChemSupply Ltd",
      reason: "Wrong Specification",
      status: "Approved",
      returnValue: 8500,
      items: 1,
      batchNumbers: ["B240109001"],
    },
  ]

  const renderPurchaseRequisitionForm = () => (
    <div className="space-y-4 max-w-6xl">
      <div className="grid grid-cols-6 gap-3">
        <div>
          <Label className="text-xs font-medium">PR Number</Label>
          <Input className="h-8 text-xs" placeholder="Auto-generated" disabled />
        </div>
        <div>
          <Label className="text-xs font-medium">Date</Label>
          <Input type="date" className="h-8 text-xs" />
        </div>
        <div>
          <Label className="text-xs font-medium">Department</Label>
          <Select>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="qc">QC Lab</SelectItem>
              <SelectItem value="packaging">Packaging</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">Requestor</Label>
          <Input className="h-8 text-xs" placeholder="Employee name" />
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
          <Label className="text-xs font-medium">Required Date</Label>
          <Input type="date" className="h-8 text-xs" />
        </div>
      </div>

      <div>
        <Label className="text-xs font-medium">Justification</Label>
        <Textarea className="text-xs" rows={2} placeholder="Business justification for this requisition" />
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-sm">Requisition Items</h4>
          <Button size="sm" className="h-7 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Add Item
          </Button>
        </div>
        <div className="grid grid-cols-12 gap-2 text-xs font-medium mb-2">
          <div className="col-span-3">Item Code / Description</div>
          <div>UOM</div>
          <div>Qty Required</div>
          <div>Est. Unit Price</div>
          <div>Est. Total</div>
          <div>Required Date</div>
          <div className="col-span-2">Specifications</div>
          <div>Actions</div>
        </div>
        <div className="grid grid-cols-12 gap-2 text-xs">
          <div className="col-span-3">
            <Input className="h-7 text-xs" placeholder="Search item..." />
          </div>
          <div>
            <Input className="h-7 text-xs" placeholder="KG" />
          </div>
          <div>
            <Input className="h-7 text-xs" placeholder="100" />
          </div>
          <div>
            <Input className="h-7 text-xs" placeholder="₹500" />
          </div>
          <div>
            <Input className="h-7 text-xs" placeholder="₹50,000" disabled />
          </div>
          <div>
            <Input type="date" className="h-7 text-xs" />
          </div>
          <div className="col-span-2">
            <Input className="h-7 text-xs" placeholder="Special requirements" />
          </div>
          <div>
            <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
              Remove
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" className="h-8 text-xs">
          Save Draft
        </Button>
        <Button size="sm" className="h-8 text-xs">
          Submit for Approval
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs bg-transparent" onClick={() => setActiveForm(null)}>
          Cancel
        </Button>
      </div>
    </div>
  )

  const renderPurchaseOrderForm = () => (
    <div className="space-y-4 max-w-6xl">
      <div className="grid grid-cols-6 gap-3">
        <div>
          <Label className="text-xs font-medium">PO Number</Label>
          <Input className="h-8 text-xs" placeholder="Auto-generated" disabled />
        </div>
        <div>
          <Label className="text-xs font-medium">Date</Label>
          <Input type="date" className="h-8 text-xs" />
        </div>
        <div>
          <Label className="text-xs font-medium">Vendor</Label>
          <Select>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chemsupply">ChemSupply Ltd</SelectItem>
              <SelectItem value="pharmaraw">PharmaRaw Inc</SelectItem>
              <SelectItem value="biomaterials">BioMaterials Co</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">Payment Terms</Label>
          <Select>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="net30">Net 30</SelectItem>
              <SelectItem value="net45">Net 45</SelectItem>
              <SelectItem value="net60">Net 60</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">Delivery Date</Label>
          <Input type="date" className="h-8 text-xs" />
        </div>
        <div>
          <Label className="text-xs font-medium">Delivery Location</Label>
          <Select>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Main Warehouse</SelectItem>
              <SelectItem value="qc">QC Lab</SelectItem>
              <SelectItem value="production">Production Floor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-sm">Purchase Order Lines</h4>
          <Button size="sm" className="h-7 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Add Line
          </Button>
        </div>
        <div className="grid grid-cols-12 gap-2 text-xs font-medium mb-2">
          <div className="col-span-3">Item Code / Description</div>
          <div>UOM</div>
          <div>Quantity</div>
          <div>Unit Price</div>
          <div>Discount %</div>
          <div>Tax %</div>
          <div>Line Total</div>
          <div>Delivery Date</div>
          <div>Actions</div>
        </div>
        <div className="grid grid-cols-12 gap-2 text-xs">
          <div className="col-span-3">
            <Input className="h-7 text-xs" placeholder="Search item..." />
          </div>
          <div>
            <Input className="h-7 text-xs" placeholder="KG" />
          </div>
          <div>
            <Input className="h-7 text-xs" placeholder="100" />
          </div>
          <div>
            <Input className="h-7 text-xs" placeholder="₹500" />
          </div>
          <div>
            <Input className="h-7 text-xs" placeholder="0" />
          </div>
          <div>
            <Input className="h-7 text-xs" placeholder="18" />
          </div>
          <div>
            <Input className="h-7 text-xs" placeholder="₹59,000" disabled />
          </div>
          <div>
            <Input type="date" className="h-7 text-xs" />
          </div>
          <div>
            <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
              Remove
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 bg-gray-50 p-3 rounded">
        <div>
          <Label className="text-xs font-medium">Subtotal</Label>
          <div className="text-sm font-medium">₹50,000</div>
        </div>
        <div>
          <Label className="text-xs font-medium">Tax Amount</Label>
          <div className="text-sm font-medium">₹9,000</div>
        </div>
        <div>
          <Label className="text-xs font-medium">Total Amount</Label>
          <div className="text-sm font-bold">₹59,000</div>
        </div>
        <div>
          <Label className="text-xs font-medium">Status</Label>
          <Badge variant="outline" className="text-xs">
            Draft
          </Badge>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" className="h-8 text-xs">
          Save
        </Button>
        <Button size="sm" className="h-8 text-xs">
          Send to Vendor
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs bg-transparent" onClick={() => setActiveForm(null)}>
          Cancel
        </Button>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <Tabs defaultValue="requisitions" className="w-full">
        <TabsList className="grid w-full grid-cols-6 max-w-4xl mb-6">
          <TabsTrigger value="requisitions">Purchase Requisitions</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="receipts">Goods Receipt</TabsTrigger>
          <TabsTrigger value="invoices">Purchase Invoices</TabsTrigger>
          <TabsTrigger value="returns">Vendor Returns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requisitions">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Purchase Requisitions</h2>
              <Button size="sm" onClick={() => setActiveForm("pr")} className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Requisition
              </Button>
            </div>

            {activeForm === "pr" ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Create Purchase Requisition</CardTitle>
                </CardHeader>
                <CardContent>{renderPurchaseRequisitionForm()}</CardContent>
              </Card>
            ) : (
              <>
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search requisitions..." className="pl-8 h-8 text-xs" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40 h-8 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                    <div className="col-span-2">PR Number</div>
                    <div>Date</div>
                    <div>Department</div>
                    <div>Requestor</div>
                    <div>Status</div>
                    <div>Priority</div>
                    <div>Items</div>
                    <div>Total Amount</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {purchaseRequisitions.map((pr) => (
                    <div key={pr.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                      <div className="col-span-2 font-medium">{pr.id}</div>
                      <div>{pr.date}</div>
                      <div>{pr.department}</div>
                      <div>{pr.requestor}</div>
                      <div>
                        <Badge variant={pr.status === "Approved" ? "default" : "secondary"} className="text-xs">
                          {pr.status}
                        </Badge>
                      </div>
                      <div>
                        <Badge
                          variant={
                            pr.priority === "High" ? "destructive" : pr.priority === "Medium" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {pr.priority}
                        </Badge>
                      </div>
                      <div>{pr.items}</div>
                      <div>₹{pr.totalAmount.toLocaleString()}</div>
                      <div className="col-span-2 flex gap-1">
                        <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                          <FileText className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Purchase Orders</h2>
              <Button size="sm" onClick={() => setActiveForm("po")} className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Purchase Order
              </Button>
            </div>

            {activeForm === "po" ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Create Purchase Order</CardTitle>
                </CardHeader>
                <CardContent>{renderPurchaseOrderForm()}</CardContent>
              </Card>
            ) : (
              <>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                    <div className="col-span-2">PO Number</div>
                    <div>Date</div>
                    <div className="col-span-2">Vendor</div>
                    <div>Status</div>
                    <div>Total Amount</div>
                    <div>Delivery Date</div>
                    <div>Items</div>
                    <div>Received</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {purchaseOrders.map((po) => (
                    <div key={po.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                      <div className="col-span-2 font-medium">{po.id}</div>
                      <div>{po.date}</div>
                      <div className="col-span-2">{po.vendor}</div>
                      <div>
                        <Badge
                          variant={po.status === "Open" ? "default" : po.status === "Closed" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {po.status}
                        </Badge>
                      </div>
                      <div>₹{po.totalAmount.toLocaleString()}</div>
                      <div>{po.deliveryDate}</div>
                      <div>{po.items}</div>
                      <div>
                        {po.received}/{po.items}
                      </div>
                      <div className="col-span-2 flex gap-1">
                        <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                          <Package className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="receipts">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Goods Receipt</h2>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Receipt
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                <div className="col-span-2">GR Number</div>
                <div>Date</div>
                <div className="col-span-2">PO Number</div>
                <div className="col-span-2">Vendor</div>
                <div>Received By</div>
                <div>Status</div>
                <div>Items</div>
                <div className="col-span-2">Actions</div>
              </div>
              {goodsReceipts.map((gr) => (
                <div key={gr.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                  <div className="col-span-2 font-medium">{gr.id}</div>
                  <div>{gr.date}</div>
                  <div className="col-span-2">{gr.poNumber}</div>
                  <div className="col-span-2">{gr.vendor}</div>
                  <div>{gr.receivedBy}</div>
                  <div>
                    <Badge variant={gr.status === "Accepted" ? "default" : "outline"} className="text-xs">
                      {gr.status}
                    </Badge>
                  </div>
                  <div>{gr.items}</div>
                  <div className="col-span-2 flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Receipt className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Purchase Invoices</h2>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Invoice
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                <div className="col-span-2">Invoice Number</div>
                <div>Date</div>
                <div className="col-span-2">Vendor</div>
                <div>PO Number</div>
                <div>Amount</div>
                <div>GST Amount</div>
                <div>Due Date</div>
                <div>Status</div>
                <div className="col-span-2">Actions</div>
              </div>
              {purchaseInvoices.map((pi) => (
                <div key={pi.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                  <div className="col-span-2 font-medium">{pi.id}</div>
                  <div>{pi.date}</div>
                  <div className="col-span-2">{pi.vendor}</div>
                  <div>{pi.poNumber}</div>
                  <div>₹{pi.amount.toLocaleString()}</div>
                  <div>₹{pi.gstAmount.toLocaleString()}</div>
                  <div>{pi.dueDate}</div>
                  <div>
                    <Badge variant={pi.status === "Paid" ? "default" : "outline"} className="text-xs">
                      {pi.status}
                    </Badge>
                  </div>
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

        <TabsContent value="returns">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Vendor Returns</h2>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Return
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs font-medium">
                <div className="col-span-2">Return Number</div>
                <div>Date</div>
                <div className="col-span-2">Vendor</div>
                <div className="col-span-2">Reason</div>
                <div>Status</div>
                <div>Return Value</div>
                <div>Items</div>
                <div className="col-span-2">Actions</div>
              </div>
              {vendorReturns.map((vr) => (
                <div key={vr.id} className="grid grid-cols-12 gap-4 p-3 border-t text-xs">
                  <div className="col-span-2 font-medium">{vr.id}</div>
                  <div>{vr.date}</div>
                  <div className="col-span-2">{vr.vendor}</div>
                  <div className="col-span-2">{vr.reason}</div>
                  <div>
                    <Badge variant={vr.status === "Approved" ? "default" : "outline"} className="text-xs">
                      {vr.status}
                    </Badge>
                  </div>
                  <div>₹{vr.returnValue.toLocaleString()}</div>
                  <div>{vr.items}</div>
                  <div className="col-span-2 flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Total Purchase Orders</div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-xs text-green-600">+12% from last month</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Pending Approvals</div>
                <div className="text-2xl font-bold">23</div>
                <div className="text-xs text-orange-600">Requires attention</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Total Spend (MTD)</div>
                <div className="text-2xl font-bold">₹45.2L</div>
                <div className="text-xs text-blue-600">Within budget</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Vendor Performance</div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-xs text-green-600">On-time delivery</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
