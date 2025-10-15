"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Plus, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RawMaterial {
  id: string
  name: string
  supplier: string
  batchNumber: string
  quantity: number
  unit: string
  expiryDate: string
  status: "in-stock" | "low-stock" | "expired" | "pending-qa"
  location: string
  cost: number
  lastUpdated: string
}

const mockRawMaterials: RawMaterial[] = [
  {
    id: "RM001",
    name: "Acetaminophen USP",
    supplier: "PharmaCorp Ltd",
    batchNumber: "AC240815001",
    quantity: 2500,
    unit: "kg",
    expiryDate: "2025-08-15",
    status: "in-stock",
    location: "Warehouse A-12",
    cost: 45.5,
    lastUpdated: "2024-12-08",
  },
  {
    id: "RM002",
    name: "Microcrystalline Cellulose",
    supplier: "CellTech Industries",
    batchNumber: "MC240720002",
    quantity: 150,
    unit: "kg",
    expiryDate: "2026-07-20",
    status: "low-stock",
    location: "Warehouse B-05",
    cost: 12.75,
    lastUpdated: "2024-12-07",
  },
  {
    id: "RM003",
    name: "Magnesium Stearate",
    supplier: "MagChem Solutions",
    batchNumber: "MS240601003",
    quantity: 0,
    unit: "kg",
    expiryDate: "2024-06-01",
    status: "expired",
    location: "Warehouse C-08",
    cost: 28.9,
    lastUpdated: "2024-12-05",
  },
  {
    id: "RM004",
    name: "Lactose Monohydrate",
    supplier: "DairyPharma Inc",
    batchNumber: "LM240910004",
    quantity: 800,
    unit: "kg",
    expiryDate: "2025-09-10",
    status: "pending-qa",
    location: "QA Hold Area",
    cost: 18.25,
    lastUpdated: "2024-12-08",
  },
  {
    id: "RM005",
    name: "Hydroxypropyl Methylcellulose",
    supplier: "PolymerTech Ltd",
    batchNumber: "HP240825005",
    quantity: 1200,
    unit: "kg",
    expiryDate: "2025-08-25",
    status: "in-stock",
    location: "Warehouse A-15",
    cost: 65.8,
    lastUpdated: "2024-12-08",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "in-stock":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "low-stock":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    case "expired":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    case "pending-qa":
      return <Clock className="h-4 w-4 text-blue-600" />
    default:
      return null
  }
}

const getStatusBadge = (status: string) => {
  const variants = {
    "in-stock": "bg-green-100 text-green-800 border-green-200",
    "low-stock": "bg-orange-100 text-orange-800 border-orange-200",
    expired: "bg-red-100 text-red-800 border-red-200",
    "pending-qa": "bg-blue-100 text-blue-800 border-blue-200",
  }

  return (
    <Badge className={`${variants[status as keyof typeof variants]} text-xs font-medium`}>
      {status.replace("-", " ").toUpperCase()}
    </Badge>
  )
}

export function RawMaterialsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [supplierFilter, setSupplierFilter] = useState("all")

  const filteredMaterials = mockRawMaterials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || material.status === statusFilter
    const matchesSupplier = supplierFilter === "all" || material.supplier === supplierFilter

    return matchesSearch && matchesStatus && matchesSupplier
  })

  const suppliers = Array.from(new Set(mockRawMaterials.map((m) => m.supplier)))

  return (
    <div className="p-6 space-y-6 bg-green-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raw Materials Management</h1>
          <p className="text-sm text-gray-600 mt-1">Inventory tracking and compliance monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-green-700 hover:bg-green-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search materials, batch numbers, suppliers..."
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
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending-qa">Pending QA</SelectItem>
              </SelectContent>
            </Select>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Materials Inventory ({filteredMaterials.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Batch Info
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cost/Unit
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Expiry</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMaterials.map((material, index) => (
                  <tr
                    key={material.id}
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{material.name}</div>
                        <div className="text-xs text-gray-500">{material.supplier}</div>
                        <div className="text-xs text-gray-400">ID: {material.id}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-mono text-gray-900">{material.batchNumber}</div>
                      <div className="text-xs text-gray-500">Updated: {material.lastUpdated}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-semibold text-gray-900">
                        {material.quantity.toLocaleString()} {material.unit}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(material.status)}
                        {getStatusBadge(material.status)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-900">{material.location}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-medium text-gray-900">${material.cost}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-900">{material.expiryDate}</div>
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Total Materials</p>
                <p className="text-2xl font-bold text-gray-900">{mockRawMaterials.length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mockRawMaterials.filter((m) => m.status === "low-stock").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockRawMaterials.filter((m) => m.status === "expired").length}
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
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Pending QA</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockRawMaterials.filter((m) => m.status === "pending-qa").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
