"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Shield, Lock, Eye, Edit, Trash2, FileText } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModule, setSelectedModule] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Mock data - replace with API call
  const permissions = [
    { id: 1, name: "dashboard.view", module: "Dashboard", description: "View dashboard", roles: 5, type: "read" },
    { id: 2, name: "users.create", module: "Users", description: "Create new users", roles: 1, type: "create" },
    { id: 3, name: "users.edit", module: "Users", description: "Edit user details", roles: 2, type: "update" },
    { id: 4, name: "users.delete", module: "Users", description: "Delete users", roles: 1, type: "delete" },
    { id: 5, name: "users.view", module: "Users", description: "View user list", roles: 3, type: "read" },
    { id: 6, name: "inventory.create", module: "Inventory", description: "Add inventory items", roles: 3, type: "create" },
    { id: 7, name: "inventory.edit", module: "Inventory", description: "Edit inventory", roles: 3, type: "update" },
    { id: 8, name: "inventory.view", module: "Inventory", description: "View inventory", roles: 5, type: "read" },
    { id: 9, name: "sales.create", module: "Sales", description: "Create sales orders", roles: 4, type: "create" },
    { id: 10, name: "sales.approve", module: "Sales", description: "Approve sales orders", roles: 2, type: "update" },
    { id: 11, name: "reports.view", module: "Reports", description: "View reports", roles: 5, type: "read" },
    { id: 12, name: "reports.export", module: "Reports", description: "Export reports", roles: 3, type: "read" },
  ]

  const modules = ["all", ...new Set(permissions.map((p) => p.module))]

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModule = selectedModule === "all" || permission.module === selectedModule
    return matchesSearch && matchesModule
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "read":
        return <Eye className="w-4 h-4" />
      case "create":
        return <Plus className="w-4 h-4" />
      case "update":
        return <Edit className="w-4 h-4" />
      case "delete":
        return <Trash2 className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      read: "secondary",
      create: "default",
      update: "outline",
      delete: "destructive",
    }
    return variants[type] || "outline"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Permission Management</h2>
          <p className="text-gray-500 mt-1">
            Manage system permissions and assign them to roles
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Permission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
              <DialogDescription>
                Define a new permission for system access control.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="permName">Permission Name</Label>
                <Input id="permName" placeholder="e.g., users.create" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="module">Module</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Permission Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description" />
              </div>
              <div className="grid gap-2">
                <Label>Assign to Roles</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="admin" />
                    <label htmlFor="admin" className="text-sm">Administrator</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="manager" />
                    <label htmlFor="manager" className="text-sm">Manager</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="user" />
                    <label htmlFor="user" className="text-sm">User</label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Create Permission</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground">System permissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.length - 1}</div>
            <p className="text-xs text-muted-foreground">Protected modules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read Permissions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {permissions.filter((p) => p.type === "read").length}
            </div>
            <p className="text-xs text-muted-foreground">View access</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Write Permissions</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {permissions.filter((p) => p.type !== "read").length}
            </div>
            <p className="text-xs text-muted-foreground">Modify access</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Permissions</CardTitle>
          <CardDescription>
            View and manage all system permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {module === "all" ? "All Modules" : module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Assigned Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-mono text-sm font-medium">
                      {permission.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{permission.module}</Badge>
                    </TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadge(permission.type)} className="gap-1">
                        {getTypeIcon(permission.type)}
                        {permission.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{permission.roles} roles</Badge>
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

