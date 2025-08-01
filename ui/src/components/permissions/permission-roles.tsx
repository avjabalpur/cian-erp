"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

interface PermissionRolesProps {
  permissionId: number
}

interface Role {
  id: number
  name: string
  description: string
  isActive: boolean
  createdAt: string
}

const getPermissionRoles = async (permissionId: number): Promise<Role[]> => {
  const { data } = await api.get(`/permissions/${permissionId}/roles`)
  return data
}

export function PermissionRoles({ permissionId }: PermissionRolesProps) {
  const { 
    data: assignedRoles = [], 
    isLoading, 
    error 
  } = useQuery<Role[], Error>({
    queryKey: ['permission-roles', permissionId],
    queryFn: () => getPermissionRoles(permissionId),
    enabled: !!permissionId,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Assigned Roles
          </CardTitle>
          <CardDescription>
            Roles that have this permission assigned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse">Loading roles...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Assigned Roles
          </CardTitle>
          <CardDescription>
            Roles that have this permission assigned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="text-red-500">Error loading roles</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Assigned Roles
        </CardTitle>
        <CardDescription className="mt-1">
          Roles that have this permission assigned
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedRoles.length > 0 ? (
                assignedRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        role.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No roles have this permission assigned.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 