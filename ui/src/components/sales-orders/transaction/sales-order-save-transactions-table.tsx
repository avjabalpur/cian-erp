"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Plus, Search, History } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import type { SalesOrderSaveTransaction } from "@/types/sales-order-extended"

interface SalesOrderSaveTransactionsTableProps {
  saveTransactions: SalesOrderSaveTransaction[]
  salesOrderId?: number
  onView?: (saveTransaction: SalesOrderSaveTransaction) => void
  onEdit?: (saveTransaction: SalesOrderSaveTransaction) => void
  onDelete?: (id: number) => void
  onCreate?: () => void
}

export default function SalesOrderSaveTransactionsTable({
  saveTransactions,
  salesOrderId,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: SalesOrderSaveTransactionsTableProps) {
  const [search, setsearch] = useState("")

  const filteredSaveTransactions = saveTransactions.filter((saveTransaction) =>
    saveTransaction.diff?.toLowerCase().includes(search.toLowerCase()) ||
    saveTransaction.createdByName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Save Transactions</CardTitle>
            <CardDescription>
              {salesOrderId
                ? "Save transaction history for this sales order"
                : "All sales order save transactions"
              }
            </CardDescription>
          </div>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
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
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredSaveTransactions.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {search ? "No transactions found matching your search" : "No transactions found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sales Order ID</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSaveTransactions.map((saveTransaction) => (
                    <TableRow key={saveTransaction.id}>
                      <TableCell className="font-medium">
                        {saveTransaction.salesOrderId}
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={saveTransaction.diff}>
                          {saveTransaction.diff || "No changes recorded"}
                        </div>
                      </TableCell>
                      <TableCell>{saveTransaction.createdByName || "Unknown User"}</TableCell>
                      <TableCell>{formatDate(saveTransaction.createdAt)}</TableCell>
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
                              <DropdownMenuItem onClick={() => onView(saveTransaction)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(saveTransaction)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && (
                              <DropdownMenuItem
                                onClick={() => onDelete(saveTransaction.id)}
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