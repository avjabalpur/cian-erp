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

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const vendors = [
    { id: 1, code: "VEN-001", name: "API Suppliers Ltd", contact: "Robert Lee", email: "robert@apisuppliers.com", category: "Raw Material", status: "Active" },
    { id: 2, code: "VEN-002", name: "PackagingPro Inc", contact: "Lisa Chen", email: "lisa@packagingpro.com", category: "Packaging", status: "Active" },
    { id: 3, code: "VEN-003", name: "ChemCorp Industries", contact: "David Kumar", email: "david@chemcorp.com", category: "Raw Material", status: "Active" },
    { id: 4, code: "VEN-004", name: "LogisticMaster", contact: "Anna Singh", email: "anna@logistic.com", category: "Logistics", status: "Active" },
  ]

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vendor Management</h2>
          <p className="text-gray-500 mt-1">Manage vendor accounts and suppliers</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Vendor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>
            {vendors.length} vendors in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search vendors..."
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
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-mono">{vendor.code}</TableCell>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.contact}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vendor.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{vendor.status}</Badge>
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

