"use client"

import { useState } from "react"
import { useQueryState } from "nuqs"
import { Button } from "@/components/ui/button"
import SalesOrdersTable from "./sales-orders-table"
import { SalesOrderFilter } from "./sales-order-filter"
import { useRouter } from "next/navigation"
import { SalesOrder } from "@/types/sales-order"
import { useSalesOrders, useDeleteSalesOrder } from "@/hooks/sales-order/use-sales-orders";
import { useSalesOrderById } from "@/hooks/sales-order/use-sales-orders";
import api from "@/lib/api";
import { Plus, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SalesOrderDrawer from "./sales-order-drawer"
import { CreateApprovalFormModal } from "./create-approval-form-modal"
import { salesOrderParsers } from "@/lib/utils/sales-order-utils"

export default function SalesOrdersManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedSalesOrder, setSelectedSalesOrder] = useState<SalesOrder | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [salesOrderToDelete, setSalesOrderToDelete] = useState<SalesOrder | null>(null)
  const [approvalFormOpen, setApprovalFormOpen] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  
  // nuqs query state hooks
  const [page] = useQueryState("page", salesOrderParsers.page);
  const [pageSize] = useQueryState("pageSize", salesOrderParsers.pageSize);
  const [sortBy] = useQueryState("sortBy", salesOrderParsers.sortBy);
  const [sortOrder] = useQueryState("sortOrder", salesOrderParsers.sortOrder);
  const [search] = useQueryState("search", salesOrderParsers.search);
  const [soStatus] = useQueryState("soStatus", salesOrderParsers.soStatus);
  const [paymentTerm] = useQueryState("paymentTerm", salesOrderParsers.paymentTerm);
  const [designUnder] = useQueryState("designUnder", salesOrderParsers.designUnder);
  const [currentStatus] = useQueryState("currentStatus", salesOrderParsers.currentStatus);
  const [isSubmitted] = useQueryState("isSubmitted", salesOrderParsers.isSubmitted);
  const [assignedDesigner] = useQueryState("assignedDesigner", salesOrderParsers.assignedDesigner);
  const [fromDate] = useQueryState("fromDate", salesOrderParsers.fromDate);
  const [toDate] = useQueryState("toDate", salesOrderParsers.toDate);

  const { data: salesOrdersData, isLoading } = useSalesOrders({
    search: search || "",
    pageNumber: page || 1,
    pageSize: pageSize || 10,
    status: soStatus || "",
    paymentTerm: paymentTerm || "",
    designUnder: designUnder || "",
    currentStatus: currentStatus || "",
    isSubmitted: isSubmitted,
    assignedDesigner: assignedDesigner,
    fromDate: fromDate?.toISOString().split('T')[0],
    toDate: toDate?.toISOString().split('T')[0],
    sortBy: sortBy || "created_at",
    sortOrder: sortOrder || "desc"
  })

  const deleteSalesOrderMutation = useDeleteSalesOrder()

  const salesOrders = salesOrdersData?.items || []
  const totalCount = salesOrdersData?.totalCount || 0

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
  }

  const handleViewQuotations = (salesOrder: SalesOrder) => {
  }

  const handleViewDocuments = (salesOrder: SalesOrder) => {
  }

  const handleNewSalesOrder = () => {
    setApprovalFormOpen(true)
  }

  const handleApprovalFormSuccess = async (salesOrderId: number) => {
    try {
      // Fetch the created sales order from the API
      const { data: newSalesOrder } = await api.get(`/sales-order/${salesOrderId}`);
      setSelectedSalesOrder(newSalesOrder);
      setDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching created sales order:', error);
      toast({
        title: "Warning",
        description: "Sales order created but there was an issue loading it for editing. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all sales orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={handleNewSalesOrder}>
            <Plus className="mr-2 h-4 w-4" />
            Create Approval Form
          </Button>
        </div>
      </div>

      <SalesOrderFilter onFilterChange={() => {}} />

      <SalesOrdersTable
        salesOrders={salesOrders}
        pageCount={Math.ceil(totalCount / (pageSize || 10))}
        pageSize={pageSize || 10}
        pageIndex={(page || 1) - 1}
        totalCount={totalCount}
        onPaginationChange={(pageIndex, newPageSize) => {
          // This will be handled by the filter component's nuqs hooks
        }}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewComments={handleViewComments}
        onViewQuotations={handleViewQuotations}
        onViewDocuments={handleViewDocuments}
        statusMap={{
          new: { label: "New", variant: "default" },
          draft: { label: "Draft", variant: "outline" },
          pending: { label: "Pending", variant: "secondary" },
          approved: { label: "Approved", variant: "default" },
          rejected: { label: "Rejected", variant: "destructive" },
          in_progress: { label: "In Progress", variant: "secondary" },
          completed: { label: "Completed", variant: "default" },
          cancelled: { label: "Cancelled", variant: "destructive" },
          repeat: { label: "Repeat", variant: "outline" }
        }}
        isLoading={isLoading}
      />

      <SalesOrderDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        salesOrder={selectedSalesOrder}
      />

      <CreateApprovalFormModal
        isOpen={approvalFormOpen}
        onClose={() => setApprovalFormOpen(false)}
        onSuccess={handleApprovalFormSuccess}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sales Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sales order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
