"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Package } from "lucide-react"

export default function ItemsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const items = [
    { id: 1, code: "ITM-001", name: "Paracetamol 500mg", category: "Raw Material", unit: "KG", stock: 1500, status: "Active" },
    { id: 2, code: "ITM-002", name: "Ibuprofen API", category: "Raw Material", unit: "KG", stock: 800, status: "Active" },
    { id: 3, code: "ITM-003", name: "Gelatin Capsules", category: "Packaging", unit: "PC", stock: 50000, status: "Active" },
    { id: 4, code: "ITM-004", name: "PVC Blister", category: "Packaging", unit: "PC", stock: 25000, status: "Active" },
    { id: 5, code: "ITM-005", name: "Glucose", category: "Excipient", unit: "KG", stock: 2000, status: "Active" },
  ]

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Item Master</h2>
          <p className="text-gray-500 mt-1">Manage inventory items and materials</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Items</CardTitle>
          <CardDescription>
            {items.length} items in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.code}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.stock}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

