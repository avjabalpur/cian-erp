"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useGetUserRoles, useAssignUserRole, useRemoveUserRole } from "@/hooks/use-users"
import { useRoles } from "@/hooks/use-roles"
import { toast } from "@/hooks/use-toast"

interface UserRolesProps {
  userId: string
}

export function UserRoles({ userId }: UserRolesProps) {
  const { data: assignedRoles = [], isLoading: loadingAssigned, refetch: refetchAssigned } = useGetUserRoles(userId)
  const { data: rolesData, isLoading: loadingAll } = useRoles()
  const allRoles = rolesData?.items || []
  const assignRole = useAssignUserRole()
  const removeRole = useRemoveUserRole()
  const [selectedRole, setSelectedRole] = useState<string>("")

  // Only show roles not already assigned
  const assignedRoleNames = assignedRoles.map((r: any) => r.name)
  const unassignedRoles = allRoles?.filter((r: any) => !assignedRoleNames.includes(r.name))

  const handleAssign = async () => {
    if (selectedRole) {
      const roleObj = allRoles.find((r: any) => r.name === selectedRole)
      if (!roleObj) return
      try {
        await assignRole.mutateAsync(
          { id: userId, roleId: roleObj.id, assignedBy: 1, isActive: true },
          {
            onSuccess: () => {
              refetchAssigned()
              setSelectedRole("")
              toast({
                title: "Success",
                description: "Role assigned successfully",
              })
            },
          }
        )
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to assign role",
          variant: "destructive",
        })
      }
    }
  }

  const handleRemove = async (roleId: string) => {
    try {
      await removeRole.mutateAsync(
        { id: userId, roleId: roleId },
        {
          onSuccess: () => {
            refetchAssigned()
            toast({
              title: "Success",
              description: "Role removed successfully",
            })
          },
        }
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      })
    }
  }

  if (loadingAssigned || loadingAll) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Manage roles for this user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse">Loading roles...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Roles</CardTitle>
        <CardDescription>Roles currently assigned to this user</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedRoles.length > 0 ? (
                assignedRoles.map((role: any) => (
                  <TableRow key={role.name}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(role.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    No roles assigned to this user.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedRole}
            onValueChange={val => setSelectedRole(val)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select role to assign" />
            </SelectTrigger>
            <SelectContent>
              {unassignedRoles.map((r: any) => (
                <SelectItem key={r.name} value={r.name}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAssign} disabled={!selectedRole}>
            Assign
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
