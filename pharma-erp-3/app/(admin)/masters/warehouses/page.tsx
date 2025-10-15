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

export default function WarehousesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const warehouses = [
    { id: 1, code: "WH-001", name: "Main Warehouse Mumbai", location: "Mumbai", capacity: 50000, occupied: 32000, status: "Active" },
    { id: 2, code: "WH-002", name: "Distribution Center Delhi", location: "Delhi", capacity: 35000, occupied: 28000, status: "Active" },
    { id: 3, code: "WH-003", name: "Cold Storage Bangalore", location: "Bangalore", capacity: 15000, occupied: 9500, status: "Active" },
    { id: 4, code: "WH-004", name: "Regional Hub Pune", location: "Pune", capacity: 25000, occupied: 18000, status: "Active" },
  ]

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Warehouse Management</h2>
          <p className="text-gray-500 mt-1">Manage warehouse facilities and locations</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Warehouse
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Warehouses</CardTitle>
          <CardDescription>
            {warehouses.length} warehouses in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search warehouses..."
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
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Occupied</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.map((warehouse) => {
                  const utilization = ((warehouse.occupied / warehouse.capacity) * 100).toFixed(0)
                  return (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-mono">{warehouse.code}</TableCell>
                      <TableCell className="font-medium">{warehouse.name}</TableCell>
                      <TableCell>{warehouse.location}</TableCell>
                      <TableCell>{warehouse.capacity.toLocaleString()} sqft</TableCell>
                      <TableCell>{warehouse.occupied.toLocaleString()} sqft</TableCell>
                      <TableCell>
                        <Badge variant={Number(utilization) > 80 ? "destructive" : "secondary"}>
                          {utilization}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{warehouse.status}</Badge>
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
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

