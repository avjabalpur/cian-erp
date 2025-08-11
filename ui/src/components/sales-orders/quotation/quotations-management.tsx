"use client"

import { useState } from "react"
import { useQueryState } from "nuqs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Download, Upload, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/shared/forms/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useQuotations } from "@/hooks/quotation/use-quotations"
import { QuotationsTable } from "./quotations-table"
import { QuotationFormModal } from "./quotation-form-modal"
import { SalesOrderQuotation } from "@/types/sales-order-extended"
import { useRouter } from "next/navigation"

interface QuotationFilters {
  dateRange?: [Date, Date];
  createdBy?: string;
  customerName?: string;
  companyName?: string;
  search?: string;
}

export default function QuotationsManagement() {
  const { toast } = useToast()
  const router = useRouter()
  
  // State management
  const [quotationFormOpen, setQuotationFormOpen] = useState(false)
  const [selectedQuotationId, setSelectedQuotationId] = useState<number | null>(null)
  const [filters, setFilters] = useState<QuotationFilters>({
    companyName: "ANY",
    customerName: "",
    search: "",
  })

  // Query state for URL persistence
  const [page] = useQueryState("page", { defaultValue: 1, parse: parseInt })
  const [pageSize] = useQueryState("pageSize", { defaultValue: 10, parse: parseInt })

  // Data fetching
  const { data: quotationsData, isLoading } = useQuotations({
    from_time: filters.dateRange?.[0]?.toISOString().split('T')[0],
    to_time: filters.dateRange?.[1]?.toISOString().split('T')[0],
    customer_name: filters.customerName,
    company_name: filters.companyName,
    page,
    pageSize,
  })

  const quotations = quotationsData?.data || []
  const totalCount = quotationsData?.totalCount || 0

  // Filter quotations based on search
  const filteredQuotations = quotations.filter((quotation) => {
    if (!filters.search) return true
    
    const searchLower = filters.search.toLowerCase()
    return (
      quotation.quotationNumber?.toLowerCase().includes(searchLower) ||
      quotation.customerName?.toLowerCase().includes(searchLower) ||
      quotation.organizationName?.toLowerCase().includes(searchLower) ||
      quotation.createdByName?.toLowerCase().includes(searchLower)
    )
  })

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

  const handleQuotationFormSuccess = async (quotationId: number) => {
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

  const resetFilters = () => {
    setFilters({
      companyName: "ANY",
      customerName: "",
      search: "",
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
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <DatePickerWithRange
                value={filters.dateRange}
                onChange={(range) => setFilters(prev => ({ ...prev, dateRange: range }))}
                placeholder="Select date range"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Select
                value={filters.companyName}
                onValueChange={(value) => setFilters(prev => ({ ...prev, companyName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANY">Any Company</SelectItem>
                  {/* {manufacturerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                placeholder="Enter customer name"
                value={filters.customerName}
                onChange={(e) => setFilters(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search quotations..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
            <span className="text-sm text-muted-foreground">
              {filteredQuotations.length} of {totalCount} quotations
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quotations Table */}
      <Card>
        <CardContent className="p-0">
          <QuotationsTable
            quotations={filteredQuotations}
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
      <QuotationFormModal
        isOpen={quotationFormOpen}
        onClose={() => setQuotationFormOpen(false)}
        onSuccess={handleQuotationFormSuccess}
        quotationId={selectedQuotationId}
      />
    </div>
  )
}
