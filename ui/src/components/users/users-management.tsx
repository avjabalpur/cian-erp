"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import UsersTable from "./users-table"
import { useRouter, useSearchParams } from "next/navigation"
import { User } from "@/types/user"
import { useUsers } from "@/hooks/use-users"
import { Plus } from "lucide-react"
import { UserDrawer } from "./user-drawer"

export default function UsersManagement() {
  const [search, setsearch] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeFilters, setActiveFilters] = useState<{ id: string; value: string }[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [sorting, setSorting] = useState<any[]>([])

  const { data: usersData, isLoading } = useUsers({
    search: search,
    pageNumber: pageIndex + 1,
    pageSize,
    columnFilters: columnFilters,
    sorting: sorting,
    globalFilter: globalFilter
  })
  const users = usersData?.items || []
  const totalCount = usersData?.totalCount || 0
  const pageCount = 10 // TODO: get from API

  const handleView = (user: User) => {
    router.push(`/users/${user.id}`)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setDrawerOpen(true)
  }

  const handleDelete = (user: User) => {
    // Implement delete logic here
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">Manage system users and their permissions</p>
        </div>
        <Button onClick={() => { setSelectedUser(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>
      <UsersTable
        users={users || []}
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
        onGlobalFilterChange={handleGlobalFilterChange}
        onColumnFiltersChange={handleColumnFiltersChange}
        onSortingChange={handleSortingChange}
      />
      <UserDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={selectedUser}
      />
    </div>
  )
}
