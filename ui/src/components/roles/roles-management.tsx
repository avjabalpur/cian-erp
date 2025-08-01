"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Role } from "@/types/role"
import { useDeleteRole, useRoles } from "@/hooks/use-roles"
import RolesTable from "./roles-table"
import { RoleDrawer } from "./role-drawer"
import { RoleDetailsDrawer } from "./role-details-drawer"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function RolesManagement() {
  const [openRoleDrawer, setOpenRoleDrawer] = useState(false)
  const [openRoleDetailsDrawer, setOpenRoleDetailsDrawer] = useState(false)
  const [role, setRole] = useState<Role | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

  const router = useRouter()
  const searchParams = useSearchParams()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [sorting, setSorting] = useState<any[]>([])


  const { data: roleData, isLoading } = useRoles()
  const roles = roleData?.items || []
  const totalCount = roles?.length || 0
  const pageCount = roles?.length || 0

  const handleView = (role: Role) => {
    setSelectedRoleId(role.id)
    setOpenRoleDetailsDrawer(true)
  }

  const handleEdit = (role: Role) => {
    setRole(role)
    setOpenRoleDrawer(true)
  }

  const handleDelete = (role: Role) => {
   try {
      deleteRole(role.id)
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      });
   } catch (error) {
    toast({
      title: 'Error',
      description: 'An error occurred. Please try again.',
      variant: 'destructive',
    });
   }
  }

  const handleGlobalFilterChange = (filter: string) => {
    setGlobalFilter(filter)
  }

  const handleColumnFiltersChange = (filters: any[]) => {
    setColumnFilters(filters)
  }

  const handleSortingChange = (sorting: any[]) => {
    setSorting(sorting)
  }

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPageIndex(pageIndex)
    setPageSize(pageSize)
  }

  const statusMap = {
    Active: { label: "Active", variant: "default" as const },
    Inactive: { label: "Inactive", variant: "secondary" as const },
    Pending: { label: "Pending", variant: "outline" as const },
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Roles</h1>
        </div>
        <Button onClick={() => { setRole(null); setOpenRoleDrawer(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
      </div>
          <RolesTable
            roles={roles}
            pageCount={pageCount}
            pageSize={pageSize}
            pageIndex={pageIndex}
            totalCount={totalCount}
            onPaginationChange={handlePaginationChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            statusMap={statusMap}
            isLoading={isLoading}
            // Server-side operations
            onGlobalFilterChange={handleGlobalFilterChange}
            onColumnFiltersChange={handleColumnFiltersChange}
            onSortingChange={handleSortingChange}
          />
          <RoleDrawer isOpen={openRoleDrawer} onClose={() => { setOpenRoleDrawer(false); setRole(null); }} role={role} />
          <RoleDetailsDrawer 
            isOpen={openRoleDetailsDrawer} 
            onClose={() => { setOpenRoleDetailsDrawer(false); setSelectedRoleId(null); }} 
            roleId={selectedRoleId} 
          />
    </div>
  )
}
