"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Search, ShieldCheck } from "lucide-react"
import { useGetRolePermissions, useAssignRolePermission, useRemoveRolePermission } from "@/hooks/use-roles"
import { usePermissions } from "@/hooks/use-permissions"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"


interface RolePermissionProps {
  roleId: number
}

export function RolePermission({ roleId }: RolePermissionProps) {
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null)
  const { 
    data: assignedPermissions = [], 
    isLoading: loadingAssigned,
    refetch: refetchAssignedPermissions 
  } = useGetRolePermissions(roleId)

  const { data: allPermissions = [], isLoading: loadingAll } = usePermissions()
  const assignPermission = useAssignRolePermission()
  const removePermission = useRemoveRolePermission()

  // assignedPermissions is now an array of permission objects
  const assignedPermissionIds = assignedPermissions.map((p: any) => Number(p.id))
  const assignedPermissionObjects = assignedPermissions
  const unassignedPermissions = allPermissions.filter(p => !assignedPermissionIds.includes(Number(p.id)))

  const handleRemove = async (permissionId: number) => {
    try {
      await removePermission.mutateAsync(
        { roleId, permissionId },
        {
          onSuccess: () => {
            refetchAssignedPermissions()
            toast({
              title: "Success",
              description: "Permission removed successfully",
            })
          },
        }
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove permission",
        variant: "destructive",
      })
    }
  }

  const handleAssign = async () => {
    if (selectedPermissionId) {
      try {
        await assignPermission.mutateAsync(
          { roleId, permissionId: selectedPermissionId },
          {
            onSuccess: () => {
              refetchAssignedPermissions()
              setSelectedPermissionId(null)
              toast({
                title: "Success",
                description: "Permission assigned successfully",
              })
            },
          }
        )
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to assign permission",
          variant: "destructive",
        })
      }
    }
  }

  if (loadingAssigned || loadingAll) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Role Permissions
          </CardTitle>
          <CardDescription>
            Manage permissions for this role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse">Loading permissions...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Role Permissions
        </CardTitle>
        <CardDescription className="mt-1">
          Permissions currently assigned to this role
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedPermissionObjects.length > 0 ? (
                assignedPermissionObjects.map((permission: any) => (
                  <TableRow key={permission.id}>
                    <TableCell>{permission.name}</TableCell>
                    <TableCell>{permission.moduleName}</TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(Number(permission.id))}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No permissions assigned to this role.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedPermissionId ? String(selectedPermissionId) : ""}
            onValueChange={val => setSelectedPermissionId(val ? Number(val) : null)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select permission to assign" />
            </SelectTrigger>
            <SelectContent>
              {unassignedPermissions.map(p => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name} ({p.moduleName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAssign} disabled={!selectedPermissionId}>
            Assign
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}