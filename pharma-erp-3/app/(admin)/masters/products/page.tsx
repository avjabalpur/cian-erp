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
import { Search, Plus, Edit, Trash2 } from "lucide-react"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const products = [
    { id: 1, code: "PRD-001", name: "Paracetamol 500mg Tablets", dosage: "Tablet", price: 45.00, status: "Active" },
    { id: 2, code: "PRD-002", name: "Ibuprofen 400mg Tablets", dosage: "Tablet", price: 65.00, status: "Active" },
    { id: 3, code: "PRD-003", name: "Amoxicillin 500mg Capsules", dosage: "Capsule", price: 125.00, status: "Active" },
    { id: 4, code: "PRD-004", name: "Cough Syrup 100ml", dosage: "Syrup", price: 85.00, status: "Active" },
    { id: 5, code: "PRD-005", name: "Vitamin C 1000mg Tablets", dosage: "Tablet", price: 55.00, status: "Active" },
  ]

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-500 mt-1">Manage finished products and formulations</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            {products.length} products in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
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
                  <TableHead>Dosage Form</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono">{product.code}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.dosage}</Badge>
                    </TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="default">{product.status}</Badge>
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

