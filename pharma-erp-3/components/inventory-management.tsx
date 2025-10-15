"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Download, Upload, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("transactions")

  // Sample data for different inventory functions
  const inventoryTransactions = [
    {
      id: "IT001",
      date: "2024-01-15",
      type: "Receipt",
      item: "Paracetamol 500mg",
      batch: "PCM240115",
      qty: 10000,
      uom: "Tablets",
      location: "WH-A-01",
      reference: "PO-2024-001",
      status: "Completed",
    },
    {
      id: "IT002",
      date: "2024-01-15",
      type: "Issue",
      item: "Amoxicillin 250mg",
      batch: "AMX240110",
      qty: -5000,
      uom: "Capsules",
      location: "WH-A-02",
      reference: "SO-2024-045",
      status: "Completed",
    },
    {
      id: "IT003",
      date: "2024-01-16",
      type: "Transfer",
      item: "Ibuprofen 400mg",
      batch: "IBU240112",
      qty: 2000,
      uom: "Tablets",
      location: "WH-B-01",
      reference: "MT-2024-012",
      status: "In Progress",
    },
    {
      id: "IT004",
      date: "2024-01-16",
      type: "Adjustment",
      item: "Cetirizine 10mg",
      batch: "CET240108",
      qty: -150,
      uom: "Tablets",
      location: "WH-A-03",
      reference: "ADJ-2024-003",
      status: "Pending",
    },
  ]

  const stockMovements = [
    {
      id: "SM001",
      timestamp: "2024-01-15 09:30",
      item: "Paracetamol 500mg",
      batch: "PCM240115",
      from: "Receiving",
      to: "WH-A-01",
      qty: 10000,
      operator: "John Smith",
      reason: "Goods Receipt",
    },
    {
      id: "SM002",
      timestamp: "2024-01-15 14:20",
      item: "Amoxicillin 250mg",
      batch: "AMX240110",
      from: "WH-A-02",
      to: "Shipping",
      qty: 5000,
      operator: "Sarah Johnson",
      reason: "Sales Order",
    },
    {
      id: "SM003",
      timestamp: "2024-01-16 10:15",
      item: "Ibuprofen 400mg",
      batch: "IBU240112",
      from: "WH-A-01",
      to: "WH-B-01",
      qty: 2000,
      operator: "Mike Wilson",
      reason: "Stock Transfer",
    },
  ]

  const cycleCounts = [
    {
      id: "CC001",
      date: "2024-01-15",
      location: "WH-A-01",
      items: 45,
      counted: 42,
      variance: 3,
      status: "In Progress",
      assignee: "Team A",
    },
    {
      id: "CC002",
      date: "2024-01-10",
      location: "WH-A-02",
      items: 38,
      counted: 38,
      variance: 0,
      status: "Completed",
      assignee: "Team B",
    },
    {
      id: "CC003",
      date: "2024-01-08",
      location: "WH-B-01",
      items: 52,
      counted: 50,
      variance: 2,
      status: "Under Review",
      assignee: "Team C",
    },
  ]

  const lotMaster = [
    {
      lotNo: "PCM240115",
      item: "Paracetamol 500mg",
      mfgDate: "2024-01-15",
      expDate: "2026-01-15",
      qty: 9850,
      status: "Active",
      supplier: "PharmaCorp",
      coa: "Available",
    },
    {
      lotNo: "AMX240110",
      item: "Amoxicillin 250mg",
      mfgDate: "2024-01-10",
      expDate: "2025-01-10",
      qty: 15000,
      status: "Active",
      supplier: "MediSupply",
      coa: "Available",
    },
    {
      lotNo: "IBU240112",
      item: "Ibuprofen 400mg",
      mfgDate: "2024-01-12",
      expDate: "2025-07-12",
      qty: 8000,
      status: "Quarantine",
      supplier: "HealthCorp",
      coa: "Pending",
    },
  ]

  const quarantineRecords = [
    {
      id: "QR001",
      item: "Ibuprofen 400mg",
      batch: "IBU240112",
      qty: 2000,
      reason: "Failed Dissolution Test",
      date: "2024-01-16",
      reviewer: "Dr. Smith",
      status: "Under Review",
    },
    {
      id: "QR002",
      item: "Aspirin 75mg",
      batch: "ASP240105",
      qty: 5000,
      reason: "Packaging Defect",
      date: "2024-01-12",
      reviewer: "Dr. Johnson",
      status: "Approved for Release",
    },
    {
      id: "QR003",
      item: "Metformin 500mg",
      batch: "MET240108",
      qty: 1500,
      reason: "Stability Study",
      date: "2024-01-14",
      reviewer: "Dr. Wilson",
      status: "Rejected",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "In Progress": { color: "bg-blue-100 text-blue-800", icon: Clock },
      Pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Under Review": { color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
      Active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      Quarantine: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      Rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
      "Approved for Release": { color: "bg-green-100 text-green-800", icon: CheckCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800",
      icon: Clock,
    }
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 max-w-6xl">
          <TabsTrigger value="transactions">Inventory Transactions</TabsTrigger>
          <TabsTrigger value="movements">Stock Movement</TabsTrigger>
          <TabsTrigger value="cycle">Cycle Count</TabsTrigger>
          <TabsTrigger value="physical">Physical Inventory</TabsTrigger>
          <TabsTrigger value="lots">Lot Master</TabsTrigger>
          <TabsTrigger value="serial">Serial Tracking</TabsTrigger>
          <TabsTrigger value="quarantine">Quarantine</TabsTrigger>
          <TabsTrigger value="transfer">Material Transfer</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventory Transactions</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search transactions..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Transaction
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Transaction ID</th>
                      <th className="text-left p-2 font-medium">Date</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Item</th>
                      <th className="text-left p-2 font-medium">Batch</th>
                      <th className="text-left p-2 font-medium">Quantity</th>
                      <th className="text-left p-2 font-medium">UOM</th>
                      <th className="text-left p-2 font-medium">Location</th>
                      <th className="text-left p-2 font-medium">Reference</th>
                      <th className="text-left p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-blue-600">{transaction.id}</td>
                        <td className="p-2">{transaction.date}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              transaction.type === "Receipt"
                                ? "default"
                                : transaction.type === "Issue"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {transaction.type}
                          </Badge>
                        </td>
                        <td className="p-2 font-medium">{transaction.item}</td>
                        <td className="p-2 font-mono">{transaction.batch}</td>
                        <td className="p-2 text-right font-mono">{transaction.qty.toLocaleString()}</td>
                        <td className="p-2">{transaction.uom}</td>
                        <td className="p-2 font-mono">{transaction.location}</td>
                        <td className="p-2 font-mono text-blue-600">{transaction.reference}</td>
                        <td className="p-2">{getStatusBadge(transaction.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Stock Movements</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search movements..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Movement ID</th>
                      <th className="text-left p-2 font-medium">Timestamp</th>
                      <th className="text-left p-2 font-medium">Item</th>
                      <th className="text-left p-2 font-medium">Batch</th>
                      <th className="text-left p-2 font-medium">From</th>
                      <th className="text-left p-2 font-medium">To</th>
                      <th className="text-left p-2 font-medium">Quantity</th>
                      <th className="text-left p-2 font-medium">Operator</th>
                      <th className="text-left p-2 font-medium">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockMovements.map((movement) => (
                      <tr key={movement.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-blue-600">{movement.id}</td>
                        <td className="p-2 font-mono">{movement.timestamp}</td>
                        <td className="p-2 font-medium">{movement.item}</td>
                        <td className="p-2 font-mono">{movement.batch}</td>
                        <td className="p-2 font-mono">{movement.from}</td>
                        <td className="p-2 font-mono">{movement.to}</td>
                        <td className="p-2 text-right font-mono">{movement.qty.toLocaleString()}</td>
                        <td className="p-2">{movement.operator}</td>
                        <td className="p-2">{movement.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycle" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cycle Count</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Cycle Count
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Count ID</th>
                      <th className="text-left p-2 font-medium">Date</th>
                      <th className="text-left p-2 font-medium">Location</th>
                      <th className="text-left p-2 font-medium">Items</th>
                      <th className="text-left p-2 font-medium">Counted</th>
                      <th className="text-left p-2 font-medium">Variance</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Assignee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cycleCounts.map((count) => (
                      <tr key={count.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-blue-600">{count.id}</td>
                        <td className="p-2">{count.date}</td>
                        <td className="p-2 font-mono">{count.location}</td>
                        <td className="p-2 text-right">{count.items}</td>
                        <td className="p-2 text-right">{count.counted}</td>
                        <td className="p-2 text-right">
                          <span className={count.variance === 0 ? "text-green-600" : "text-red-600 font-medium"}>
                            {count.variance}
                          </span>
                        </td>
                        <td className="p-2">{getStatusBadge(count.status)}</td>
                        <td className="p-2">{count.assignee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lots" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lot Master</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search lots..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Lot
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Lot Number</th>
                      <th className="text-left p-2 font-medium">Item</th>
                      <th className="text-left p-2 font-medium">Mfg Date</th>
                      <th className="text-left p-2 font-medium">Exp Date</th>
                      <th className="text-left p-2 font-medium">Quantity</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Supplier</th>
                      <th className="text-left p-2 font-medium">COA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotMaster.map((lot) => (
                      <tr key={lot.lotNo} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-blue-600">{lot.lotNo}</td>
                        <td className="p-2 font-medium">{lot.item}</td>
                        <td className="p-2">{lot.mfgDate}</td>
                        <td className="p-2">{lot.expDate}</td>
                        <td className="p-2 text-right font-mono">{lot.qty.toLocaleString()}</td>
                        <td className="p-2">{getStatusBadge(lot.status)}</td>
                        <td className="p-2">{lot.supplier}</td>
                        <td className="p-2">
                          <Badge variant={lot.coa === "Available" ? "default" : "secondary"}>{lot.coa}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarantine" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quarantine Records</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search quarantine..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Quarantine
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">QR ID</th>
                      <th className="text-left p-2 font-medium">Item</th>
                      <th className="text-left p-2 font-medium">Batch</th>
                      <th className="text-left p-2 font-medium">Quantity</th>
                      <th className="text-left p-2 font-medium">Reason</th>
                      <th className="text-left p-2 font-medium">Date</th>
                      <th className="text-left p-2 font-medium">Reviewer</th>
                      <th className="text-left p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarantineRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-blue-600">{record.id}</td>
                        <td className="p-2 font-medium">{record.item}</td>
                        <td className="p-2 font-mono">{record.batch}</td>
                        <td className="p-2 text-right font-mono">{record.qty.toLocaleString()}</td>
                        <td className="p-2">{record.reason}</td>
                        <td className="p-2">{record.date}</td>
                        <td className="p-2">{record.reviewer}</td>
                        <td className="p-2">{getStatusBadge(record.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="physical" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Physical Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">Physical Inventory Management - Coming Soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="serial" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Serial Number Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">Serial Number Tracking - Coming Soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">Material Transfer Management - Coming Soon</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
