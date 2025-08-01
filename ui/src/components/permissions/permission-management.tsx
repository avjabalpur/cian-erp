"use client"

import { useState } from "react"
import { useDeletePermission, usePermissions } from "@/hooks/use-permissions"
import { Permission } from "@/types/permission"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PermissionTable } from "./permission-table"
import { PermissionDrawer } from "./permission-drawer"
import { PermissionDetailsDrawer } from "./permission-details-drawer"
import { toast } from "@/hooks/use-toast"

export default function PermissionManagement() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openDetailsDrawer, setOpenDetailsDrawer] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [sorting, setSorting] = useState<any[]>([])

  const { data: permissions = [], isLoading } = usePermissions()
  const totalCount = permissions.length
  const pageCount = permissions.length
  const { mutate: deletePermissionMution, isPending: isDeleting } = useDeletePermission();

  const handleView = (permission: Permission) => {
    setSelectedPermissionId(permission.id)
    setOpenDetailsDrawer(true)
  }

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setOpenDrawer(true)
  }

  const handleDelete = (permission: Permission) => {
    try {
      deletePermissionMution(permission.id)
      toast({
        title: "Success",
        description: "Permission deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete permission",
        variant: "destructive",
      })
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

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Permissions</h1>
        </div>
        <Button onClick={() => { setSelectedPermission(null); setOpenDrawer(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Permission
        </Button>
      </div>
      <PermissionTable
        permissions={permissions}
        pageCount={pageCount}
        pageSize={pageSize}
        pageIndex={pageIndex}
        totalCount={totalCount}
        onPaginationChange={handlePaginationChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        onGlobalFilterChange={handleGlobalFilterChange}
        onColumnFiltersChange={handleColumnFiltersChange}
        onSortingChange={handleSortingChange}
      />
      <PermissionDrawer
        isOpen={openDrawer}
        onClose={() => { setOpenDrawer(false); setSelectedPermission(null); }}
        permission={selectedPermission}
      />
      <PermissionDetailsDrawer
        isOpen={openDetailsDrawer}
        onClose={() => { setOpenDetailsDrawer(false); setSelectedPermissionId(null); }}
        permissionId={selectedPermissionId}
      />
    </div>
  )
}
