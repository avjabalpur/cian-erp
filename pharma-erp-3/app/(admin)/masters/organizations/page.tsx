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

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const organizations = [
    { id: 1, code: "MAIN", name: "PharmaERP Main", description: "Main organization", type: "Headquarters", status: "Active" },
    { id: 2, code: "MUM", name: "Mumbai Branch", description: "Mumbai operations", type: "Branch", status: "Active" },
    { id: 3, code: "DEL", name: "Delhi Branch", description: "Delhi operations", type: "Branch", status: "Active" },
    { id: 4, code: "BLR", name: "Bangalore R&D", description: "Research facility", type: "R&D Center", status: "Active" },
  ]

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organization Management</h2>
          <p className="text-gray-500 mt-1">Manage organizational units</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Organization
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
          <CardDescription>
            {organizations.length} organizations in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search organizations..."
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
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-mono">{org.code}</TableCell>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{org.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{org.status}</Badge>
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

