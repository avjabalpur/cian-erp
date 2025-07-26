"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"

export default function SalesOrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Mock data - in real app, this would come from API
  const salesOrders = [
    {
      id: 1,
      soNumber: "SO-2024-001",
      customerName: "City General Hospital",
      soDate: "2024-01-15",
      quotationNo: "QT-2024-001",
      itemName: "Paracetamol 500mg Tablets",
      quantity: 1000,
      mrp: 25.5,
      billingRate: 22.5,
      totalAmount: 22500,
      status: "new",
      currentStatus: "Design Review",
      createdBy: "Sales Manager",
    },
    {
      id: 2,
      soNumber: "SO-2024-002",
      customerName: "MedPlus Pharmacy",
      soDate: "2024-01-14",
      quotationNo: "QT-2024-002",
      itemName: "Amoxicillin 250mg Capsules",
      quantity: 500,
      mrp: 85.0,
      billingRate: 75.0,
      totalAmount: 37500,
      status: "repeat",
      currentStatus: "Production Planning",
      createdBy: "Sales Executive",
    },
    {
      id: 3,
      soNumber: "SO-2024-003",
      customerName: "Apollo Distributors",
      soDate: "2024-01-13",
      quotationNo: "QT-2024-003",
      itemName: "Insulin Injection 100IU/ml",
      quantity: 200,
      mrp: 450.0,
      billingRate: 400.0,
      totalAmount: 80000,
      status: "revised",
      currentStatus: "Quality Approval",
      createdBy: "Sales Manager",
    },
  ]

  const filteredOrders = salesOrders.filter(
    (order) =>
      order.soNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">New</Badge>
      case "repeat":
        return <Badge variant="secondary">Repeat</Badge>
      case "revised":
        return <Badge variant="outline">Revised</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
          <p className="mt-2 text-gray-600">Manage sales orders and customer requirements</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create SO
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Sales Order</DialogTitle>
              <DialogDescription>Create a new sales order for customer requirements.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="soNumber">SO Number</Label>
                  <Input id="soNumber" placeholder="SO-2024-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soDate">SO Date</Label>
                  <Input id="soDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soStatus">SO Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="repeat">Repeat</SelectItem>
                      <SelectItem value="revised">Revised</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city">City General Hospital</SelectItem>
                      <SelectItem value="medplus">MedPlus Pharmacy</SelectItem>
                      <SelectItem value="apollo">Apollo Distributors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quotationNo">Quotation No</Label>
                  <Input id="quotationNo" placeholder="QT-2024-001" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product Details</Label>
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Item</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="para">Paracetamol 500mg</SelectItem>
                          <SelectItem value="amoxi">Amoxicillin 250mg</SelectItem>
                          <SelectItem value="insulin">Insulin Injection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dosageName">Dosage Form</Label>
                      <Input id="dosageName" placeholder="Tablet/Capsule/Injection" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" type="number" placeholder="1000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mrp">MRP (₹)</Label>
                      <Input id="mrp" type="number" placeholder="25.50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingRate">Billing Rate (₹)</Label>
                      <Input id="billingRate" type="number" placeholder="22.50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="packShort">Pack Description</Label>
                      <Input id="packShort" placeholder="10x10 Blister Pack" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="composition">Composition</Label>
                      <Input id="composition" placeholder="Paracetamol 500mg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>
                Create Sales Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Orders</CardTitle>
          <CardDescription>A list of all sales orders with their current processing status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search sales orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SO Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Rates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.soNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.itemName}</p>
                      <p className="text-sm text-gray-500">{order.quotationNo}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.quantity.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>MRP: ₹{order.mrp}</p>
                      <p>Rate: ₹{order.billingRate}</p>
                    </div>
                  </TableCell>
                  <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.currentStatus}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
