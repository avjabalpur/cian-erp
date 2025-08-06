"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Plus, Search, Calculator } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import type { SalesOrderQuotation } from "@/types/sales-order-extended"

interface SalesOrderQuotationsTableProps {
  quotations: SalesOrderQuotation[]
  salesOrderId?: number
  onView?: (quotation: SalesOrderQuotation) => void
  onEdit?: (quotation: SalesOrderQuotation) => void
  onDelete?: (id: number) => void
  onCreate?: () => void
}

export default function SalesOrderQuotationsTable({
  quotations,
  salesOrderId,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: SalesOrderQuotationsTableProps) {
  const [search, setsearch] = useState("")

  const filteredQuotations = quotations.filter((quotation) =>
    quotation.quotationNumber.toLowerCase().includes(search.toLowerCase()) ||
    quotation.organizationName?.toLowerCase().includes(search.toLowerCase()) ||
    quotation.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    quotation.createdByName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quotations</CardTitle>
            <CardDescription>
              {salesOrderId
                ? "Quotations for this sales order"
                : "All sales order quotations"
              }
            </CardDescription>
          </div>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Quotation
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
                placeholder="Search quotations..."
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredQuotations.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {search ? "No quotations found matching your search" : "No quotations found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Advance %</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium">
                        {quotation.quotationNumber}
                      </TableCell>
                      <TableCell>
                        {quotation.quotationDate ? formatDate(quotation.quotationDate) : "-"}
                      </TableCell>
                      <TableCell>
                        {quotation.organizationName || "-"}
                      </TableCell>
                      <TableCell>
                        {quotation.customerName || "-"}
                      </TableCell>
                      <TableCell>
                        {quotation.totalAmount ? `$${quotation.totalAmount.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell>
                        {quotation.advancePercentage ? `${quotation.advancePercentage}%` : "-"}
                      </TableCell>
                      <TableCell>{quotation.createdByName || "Unknown User"}</TableCell>
                      <TableCell>{formatDate(quotation.createdAt)}</TableCell>
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
                              <DropdownMenuItem onClick={() => onView(quotation)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onEdit && !quotation.isDeleted && (
                              <DropdownMenuItem onClick={() => onEdit(quotation)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && !quotation.isDeleted && (
                              <DropdownMenuItem
                                onClick={() => onDelete(quotation.id)}
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