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

export default function DivisionsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const divisions = [
    { id: 1, code: "PHARM", name: "Pharmaceuticals", description: "Pharmaceutical products division", status: "Active", products: 150 },
    { id: 2, code: "BIO", name: "Biologics", description: "Biological products and vaccines", status: "Active", products: 45 },
    { id: 3, code: "OTC", name: "Over-the-Counter", description: "OTC medications", status: "Active", products: 80 },
    { id: 4, code: "API", name: "Active Ingredients", description: "API manufacturing", status: "Active", products: 65 },
  ]

  const filteredDivisions = divisions.filter((div) =>
    div.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    div.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Division Management</h2>
          <p className="text-gray-500 mt-1">Manage business divisions</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Division
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Divisions</CardTitle>
          <CardDescription>
            {divisions.length} divisions in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search divisions..."
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
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDivisions.map((div) => (
                  <TableRow key={div.id}>
                    <TableCell className="font-mono">{div.code}</TableCell>
                    <TableCell className="font-medium">{div.name}</TableCell>
                    <TableCell>{div.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{div.products}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{div.status}</Badge>
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

