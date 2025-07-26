"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import SalesOrdersTable from "./sales-orders-table"
import { useRouter, useSearchParams } from "next/navigation"
import { SalesOrder } from "@/types/sales-order"
import { useSalesOrders, useDeleteSalesOrder } from "@/hooks/use-sales-orders"
import { Plus, Filter, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SalesOrderDrawer from "./sales-order-drawer"

export default function SalesOrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedSalesOrder, setSelectedSalesOrder] = useState<SalesOrder | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [salesOrderToDelete, setSalesOrderToDelete] = useState<SalesOrder | null>(null)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [activeFilters, setActiveFilters] = useState<{ id: string; value: string }[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [sorting, setSorting] = useState<any[]>([])

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [customerFilter, setCustomerFilter] = useState<string>('')
  const [organizationFilter, setOrganizationFilter] = useState<string>('')
  const [fromDateFilter, setFromDateFilter] = useState<string>('')
  const [toDateFilter, setToDateFilter] = useState<string>('')
  const [submittedFilter, setSubmittedFilter] = useState<string>('')

  const { data: salesOrders, isLoading } = useSalesOrders({
    search: searchTerm,
    pageNumber: pageIndex + 1,
    pageSize,
    status: statusFilter,
    customerId: customerFilter ? parseInt(customerFilter) : undefined,
    organizationId: organizationFilter ? parseInt(organizationFilter) : undefined,
    fromDate: fromDateFilter,
    toDate: toDateFilter,
    isSubmitted: submittedFilter === 'true' ? true : submittedFilter === 'false' ? false : undefined,
    columnFilters: columnFilters,
    sorting: sorting,
    globalFilter: globalFilter
  })

  const deleteSalesOrderMutation = useDeleteSalesOrder()

  const totalCount = salesOrders?.length || 0
  const pageCount = Math.ceil(totalCount / pageSize)

  const handleView = (salesOrder: SalesOrder) => {
    router.push(`/sales-orders/${salesOrder.id}`)
  }

  const handleEdit = (salesOrder: SalesOrder) => {
    setSelectedSalesOrder(salesOrder)
    setDrawerOpen(true)
  }

  const handleDelete = (salesOrder: SalesOrder) => {
    setSalesOrderToDelete(salesOrder)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!salesOrderToDelete) return

    try {
      await deleteSalesOrderMutation.mutateAsync(salesOrderToDelete.id.toString())
      toast({
        title: "Success",
        description: "Sales order deleted successfully",
      })
      setDeleteDialogOpen(false)
      setSalesOrderToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sales order",
        variant: "destructive",
      })
    }
  }

  const handleViewComments = (salesOrder: SalesOrder) => {
    router.push(`/sales-orders/${salesOrder.id}/comments`)
  }

  const handleViewQuotations = (salesOrder: SalesOrder) => {
    router.push(`/sales-orders/${salesOrder.id}/quotations`)
  }

  const handleViewDocuments = (salesOrder: SalesOrder) => {
    router.push(`/sales-orders/${salesOrder.id}/documents`)
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

  const applyFilters = () => {
    // Apply the filters and close dialog
    setFilterDialogOpen(false)
  }

  const clearFilters = () => {
    setStatusFilter('')
    setCustomerFilter('')
    setOrganizationFilter('')
    setFromDateFilter('')
    setToDateFilter('')
    setSubmittedFilter('')
  }

  const statusMap = {
    Draft: { label: "Draft", variant: "outline" as const },
    Submitted: { label: "Submitted", variant: "default" as const },
    Approved: { label: "Approved", variant: "default" as const },
    Rejected: { label: "Rejected", variant: "destructive" as const },
    InProgress: { label: "In Progress", variant: "secondary" as const },
    Completed: { label: "Completed", variant: "default" as const },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Orders Management</h1>
          <p className="mt-2 text-gray-600">Manage sales orders and track their progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => { setSelectedSalesOrder(null); setDrawerOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Sales Order
          </Button>
        </div>
      </div>

      <SalesOrdersTable
        salesOrders={salesOrders || []}
        pageCount={pageCount}
        pageSize={pageSize}
        pageIndex={pageIndex}
        totalCount={totalCount}
        onPaginationChange={handlePaginationChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewComments={handleViewComments}
        onViewQuotations={handleViewQuotations}
        onViewDocuments={handleViewDocuments}
        statusMap={statusMap}
        isLoading={isLoading}
        onGlobalFilterChange={handleGlobalFilterChange}
        onColumnFiltersChange={handleColumnFiltersChange}
        onSortingChange={handleSortingChange}
      />

      {/* Sales Order Drawer */}
      <SalesOrderDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        salesOrder={selectedSalesOrder}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sales Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the sales order "{salesOrderToDelete?.soNumber}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteSalesOrderMutation.isPending}
            >
              {deleteSalesOrderMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Sales Orders</DialogTitle>
            <DialogDescription>
              Apply filters to narrow down the sales orders list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="submitted">Submitted</Label>
              <Select value={submittedFilter} onValueChange={setSubmittedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select submission status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="true">Submitted</SelectItem>
                  <SelectItem value="false">Not Submitted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDateFilter}
                onChange={(e) => setFromDateFilter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={toDateFilter}
                onChange={(e) => setToDateFilter(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button onClick={applyFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
