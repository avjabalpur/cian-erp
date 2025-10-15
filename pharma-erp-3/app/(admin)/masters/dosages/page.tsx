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

export default function DosagesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const dosages = [
    { id: 1, code: "TAB", name: "Tablet", description: "Oral tablet form", status: "Active", products: 120 },
    { id: 2, code: "CAP", name: "Capsule", description: "Oral capsule form", status: "Active", products: 85 },
    { id: 3, code: "SYR", name: "Syrup", description: "Liquid syrup form", status: "Active", products: 45 },
    { id: 4, code: "INJ", name: "Injection", description: "Injectable form", status: "Active", products: 60 },
    { id: 5, code: "CRM", name: "Cream", description: "Topical cream", status: "Active", products: 30 },
  ]

  const filteredDosages = dosages.filter((dosage) =>
    dosage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dosage.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dosage Form Management</h2>
          <p className="text-gray-500 mt-1">Manage pharmaceutical dosage forms</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Dosage Form
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Dosage Forms</CardTitle>
          <CardDescription>
            {dosages.length} dosage forms in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search dosage forms..."
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
                {filteredDosages.map((dosage) => (
                  <TableRow key={dosage.id}>
                    <TableCell className="font-mono">{dosage.code}</TableCell>
                    <TableCell className="font-medium">{dosage.name}</TableCell>
                    <TableCell>{dosage.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{dosage.products}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{dosage.status}</Badge>
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

