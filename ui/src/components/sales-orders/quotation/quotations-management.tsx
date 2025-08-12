"use client"

import { useState } from "react"
import { useQueryState } from "nuqs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useQuotations } from "@/hooks/quotation/use-quotations"
import { QuotationsTable } from "./quotations-table"
import { QuotationFilter } from "./quotation-filter"
import { SalesOrderQuotation } from "@/types/sales-order-extended"
import { useRouter } from "next/navigation"
import { QuotationDrawer } from "./quotation-drawer"

export default function QuotationsManagement() {
  const { toast } = useToast()
  const router = useRouter()
  
  // State management
  const [quotationFormOpen, setQuotationFormOpen] = useState(false)
  const [selectedQuotationId, setSelectedQuotationId] = useState<number | null>(null)

  // Query state for URL persistence
  const [page] = useQueryState("page", { defaultValue: 1, parse: parseInt })
  const [pageSize] = useQueryState("pageSize", { defaultValue: 10, parse: parseInt })

  // Data fetching
  const { data: quotationsData, isLoading } = useQuotations()

  const quotations = quotationsData?.data || []
  const totalCount = quotationsData?.totalCount || 0

  const handleView = (quotation: SalesOrderQuotation) => {
    router.push(`/quotations/${quotation.id}`)
  }

  const handleEdit = (quotation: SalesOrderQuotation) => {
    setSelectedQuotationId(quotation.id)
    setQuotationFormOpen(true)
  }

  const handleCreateNew = () => {
    setSelectedQuotationId(null)
    setQuotationFormOpen(true)
  }

  const handleCopyLink = (quotation: SalesOrderQuotation) => {
    const url = `${window.location.origin}/quotations/${quotation.id}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied",
      description: "Quotation link copied to clipboard",
    })
  }

  const handleQuotationFormSuccess = async () => {
    setQuotationFormOpen(false)
    setSelectedQuotationId(null)
    toast({
      title: "Success",
      description: selectedQuotationId ? "Quotation updated successfully" : "Quotation created successfully",
    })
  }

  const handleExport = () => {
    toast({
      title: "Info",
      description: "Export functionality will be implemented",
    })
  }

  const handleImport = () => {
    toast({
      title: "Info", 
      description: "Import functionality will be implemented",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Manage and track all quotations with advanced filtering
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Quotation
          </Button>
        </div>
      </div>

      {/* Filters */}
     

      {/* Quotations Table */}
      <Card>
      <CardContent className="space-y-4 pt-4">
        <QuotationFilter />
          <QuotationsTable
            quotations={quotations}
            pageCount={Math.ceil(totalCount / pageSize)}
            pageSize={pageSize}
            pageIndex={page - 1}
            totalCount={totalCount}
            onPaginationChange={(pageIndex: number, newPageSize: number) => {
              // This will be handled by the nuqs hooks
            }}
            onView={handleView}
            onEdit={handleEdit}
            onCopyLink={handleCopyLink}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Quotation Form Modal */}
      <QuotationDrawer
        quotationId={selectedQuotationId}
        isOpen={quotationFormOpen}
        onClose={() => setQuotationFormOpen(false)}
        onSuccess={handleQuotationFormSuccess}
      />
    </div>
  )
}
