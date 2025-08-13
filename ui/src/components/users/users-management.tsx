"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import UsersTable from "./users-table"
import { useRouter, useSearchParams } from "next/navigation"
import { User } from "@/types/user"
import { useUsers, useDeleteUser } from "@/hooks/use-users"
import { Plus } from "lucide-react"
import { UserDrawer } from "./user-drawer"
import { UserDetailsDrawer } from "./user-details-drawer"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function UsersManagement() {
  const [search, setsearch] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

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
  
  const deleteUserMutation = useDeleteUser()
  
  const users = usersData?.items || []
  const totalCount = usersData?.totalCount || 0
  const pageCount = 10 // TODO: get from API

  const handleView = (user: User) => {
    setSelectedUser(user)
    setDetailsDrawerOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setDrawerOpen(true)
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id.toString())
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
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

  const statusMap = {
    Active: { label: "Active", variant: "default" as const },
    Inactive: { label: "Inactive", variant: "secondary" as const },
    Pending: { label: "Pending", variant: "outline" as const },
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
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
      
      <UserDetailsDrawer
        isOpen={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        userId={selectedUser?.id || null}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user "{userToDelete?.firstName} {userToDelete?.lastName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
