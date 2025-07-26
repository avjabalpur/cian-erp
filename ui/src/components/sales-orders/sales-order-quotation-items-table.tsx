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
import type { SalesOrderQuotationItem } from "@/types/sales-order-extended"
import { salesOrderQuotationItemApi } from "@/lib/api/sales-order-extended"

interface SalesOrderQuotationItemsTableProps {
  quotationId?: number
  salesOrderId?: number
  onView?: (quotationItem: SalesOrderQuotationItem) => void
  onEdit?: (quotationItem: SalesOrderQuotationItem) => void
  onDelete?: (id: number) => void
  onCreate?: () => void
}

export default function SalesOrderQuotationItemsTable({
  quotationId,
  salesOrderId,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: SalesOrderQuotationItemsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: quotationItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: quotationId 
      ? ["salesOrderQuotationItems", quotationId] 
      : salesOrderId 
      ? ["salesOrderQuotationItems", "salesOrder", salesOrderId]
      : ["salesOrderQuotationItems"],
    queryFn: () => {
      if (quotationId) {
        return salesOrderQuotationItemApi.getByQuotationId(quotationId)
      } else if (salesOrderId) {
        return salesOrderQuotationItemApi.getBySalesOrder(salesOrderId)
      } else {
        return salesOrderQuotationItemApi.getAll()
      }
    },
  })

  const filteredQuotationItems = quotationItems.filter((item) =>
    item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.composition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.dosageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.soStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quotation Items</CardTitle>
          <CardDescription>Loading quotation items...</CardDescription>
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
          <CardTitle>Quotation Items</CardTitle>
          <CardDescription>Error loading quotation items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-red-500">Failed to load quotation items</p>
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
            <CardTitle>Quotation Items</CardTitle>
            <CardDescription>
              {quotationId 
                ? "Items for this quotation" 
                : salesOrderId 
                ? "Quotation items for this sales order"
                : "All quotation items"
              }
            </CardDescription>
          </div>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
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
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredQuotationItems.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {searchTerm ? "No items found matching your search" : "No quotation items found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Composition</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Pack Size</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead>Billing Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tax %</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotationItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.itemName || `Item ${item.itemId}`}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {item.composition || "-"}
                      </TableCell>
                      <TableCell>{item.dosageName || "-"}</TableCell>
                      <TableCell>{item.pPackShort || "-"}</TableCell>
                      <TableCell>
                        {item.pQuantity ? item.pQuantity.toFixed(2) : "-"}
                        {item.pFocQty && item.pFocQty > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            +{item.pFocQty.toFixed(2)} FOC
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.pMrp ? `$${item.pMrp.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell>
                        {item.pBillingRate ? `$${item.pBillingRate.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.soStatus === "Active" ? "default" : "secondary"}>
                          {item.soStatus || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.taxPercent ? `${item.taxPercent.toFixed(2)}%` : "-"}
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
                              <DropdownMenuItem onClick={() => onView(item)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onEdit && !item.isDeleted && (
                              <DropdownMenuItem onClick={() => onEdit(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && !item.isDeleted && (
                              <DropdownMenuItem 
                                onClick={() => onDelete(item.id)}
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