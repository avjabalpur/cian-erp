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

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const customers = [
    { id: 1, code: "CUS-001", name: "Apollo Hospitals", contact: "John Smith", email: "john@apollo.com", city: "Mumbai", status: "Active" },
    { id: 2, code: "CUS-002", name: "Max Healthcare", contact: "Sarah Jones", email: "sarah@max.com", city: "Delhi", status: "Active" },
    { id: 3, code: "CUS-003", name: "Fortis Hospital", contact: "Mike Brown", email: "mike@fortis.com", city: "Bangalore", status: "Active" },
    { id: 4, code: "CUS-004", name: "Medanta", contact: "Emma Wilson", email: "emma@medanta.com", city: "Gurgaon", status: "Active" },
  ]

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-500 mt-1">Manage customer accounts and relationships</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>
            {customers.length} customers in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
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
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-mono">{customer.code}</TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.contact}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>
                      <Badge variant="default">{customer.status}</Badge>
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

