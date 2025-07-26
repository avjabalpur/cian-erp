"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Plus, Search } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import type { SalesOrderPerformaInvoice } from "@/types/sales-order-extended"
import { salesOrderPerformaInvoiceApi } from "@/lib/api/sales-order-extended"

interface SalesOrderPerformaInvoiceTableProps {
  salesOrderId?: number
  onView?: (performaInvoice: SalesOrderPerformaInvoice) => void
  onEdit?: (performaInvoice: SalesOrderPerformaInvoice) => void
  onDelete?: (id: number) => void
  onCreate?: () => void
}

export default function SalesOrderPerformaInvoiceTable({
  salesOrderId,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: SalesOrderPerformaInvoiceTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: performaInvoices = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: salesOrderId 
      ? ["salesOrderPerformaInvoices", salesOrderId] 
      : ["salesOrderPerformaInvoices"],
    queryFn: () => salesOrderId 
      ? salesOrderPerformaInvoiceApi.getBySalesOrder(salesOrderId)
      : salesOrderPerformaInvoiceApi.getAll(),
  })

  const filteredPerformaInvoices = performaInvoices.filter((performaInvoice) =>
    performaInvoice.performaInvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performaInvoice.exporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performaInvoice.consigneeName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performa Invoices</CardTitle>
          <CardDescription>Loading performa invoices...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performa Invoices</CardTitle>
          <CardDescription>Error loading performa invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-red-500">Failed to load performa invoices</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Performa Invoices</CardTitle>
            <CardDescription>
              {salesOrderId 
                ? "Performa invoices for this sales order" 
                : "All performa invoices"
              }
            </CardDescription>
          </div>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredPerformaInvoices.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {searchTerm ? "No invoices found matching your search" : "No performa invoices found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Exporter</TableHead>
                    <TableHead>Consignee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPerformaInvoices.map((performaInvoice) => (
                    <TableRow key={performaInvoice.id}>
                      <TableCell className="font-medium">
                        {performaInvoice.performaInvoiceNumber}
                      </TableCell>
                      <TableCell>{performaInvoice.exporterName}</TableCell>
                      <TableCell>{performaInvoice.consigneeName}</TableCell>
                      <TableCell>
                        {performaInvoice.performaInvoiceDate 
                          ? formatDate(performaInvoice.performaInvoiceDate)
                          : "-"
                        }
                      </TableCell>
                      <TableCell>
                        {performaInvoice.totalAmount 
                          ? `$${performaInvoice.totalAmount.toFixed(2)}`
                          : "-"
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={performaInvoice.isDeleted ? "destructive" : "default"}>
                          {performaInvoice.isDeleted ? "Deleted" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onView && (
                              <DropdownMenuItem onClick={() => onView(performaInvoice)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onEdit && !performaInvoice.isDeleted && (
                              <DropdownMenuItem onClick={() => onEdit(performaInvoice)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && !performaInvoice.isDeleted && (
                              <DropdownMenuItem 
                                onClick={() => onDelete(performaInvoice.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 