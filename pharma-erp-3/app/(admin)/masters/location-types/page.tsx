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

export default function LocationTypesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const locationTypes = [
    { id: 1, code: "PLANT", name: "Manufacturing Plant", description: "Production facility", status: "Active", locations: 5 },
    { id: 2, code: "WH", name: "Warehouse", description: "Storage warehouse", status: "Active", locations: 8 },
    { id: 3, code: "DC", name: "Distribution Center", description: "Distribution facility", status: "Active", locations: 12 },
    { id: 4, code: "OFF", name: "Office", description: "Corporate office", status: "Active", locations: 3 },
    { id: 5, code: "LAB", name: "Laboratory", description: "Testing laboratory", status: "Active", locations: 4 },
  ]

  const filteredLocationTypes = locationTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Location Type Management</h2>
          <p className="text-gray-500 mt-1">Manage location types and categories</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Location Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Location Types</CardTitle>
          <CardDescription>
            {locationTypes.length} location types in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search location types..."
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
                  <TableHead>Description</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocationTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-mono">{type.code}</TableCell>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{type.locations}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{type.status}</Badge>
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

