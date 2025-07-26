"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Plus, Search, MessageSquare } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import type { SalesOrderComment } from "@/types/sales-order-extended"
import { useCommentsBySalesOrder } from "@/hooks/use-sales-order-extended"

interface SalesOrderCommentsTableProps {
  salesOrderId?: number
  onView?: (comment: SalesOrderComment) => void
  onEdit?: (comment: SalesOrderComment) => void
  onDelete?: (id: number) => void
  onCreate?: () => void
}

export default function SalesOrderCommentsTable({
  salesOrderId,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: SalesOrderCommentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: comments = [],
    isLoading,
    error,
  } = useCommentsBySalesOrder(salesOrderId || 0)

  const filteredComments = comments.filter((comment: SalesOrderComment) =>
    comment.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.createdByName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>Loading comments...</CardDescription>
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
          <CardTitle>Comments</CardTitle>
          <CardDescription>Error loading comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-red-500">Error loading comments</p>
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
            <CardTitle>Comments</CardTitle>
            <CardDescription>
              {salesOrderId
                ? "Comments for this sales order"
                : "All sales order comments"
              }
            </CardDescription>
          </div>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Comment
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
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredComments.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {searchTerm ? "No comments found matching your search" : "No comments found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComments.map((comment: SalesOrderComment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={comment.comments}>
                          {comment.comments}
                        </div>
                      </TableCell>
                      <TableCell>
                        {comment.type ? (
                          <Badge variant="outline">{comment.type}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {comment.status ? (
                          <Badge variant={comment.status === "Active" ? "default" : "secondary"}>
                            {comment.status}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{comment.createdByName || "Unknown User"}</TableCell>
                      <TableCell>{formatDate(comment.createdAt)}</TableCell>
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
                              <DropdownMenuItem onClick={() => onView(comment)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onEdit && !comment.isDeleted && (
                              <DropdownMenuItem onClick={() => onEdit(comment)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && !comment.isDeleted && (
                              <DropdownMenuItem
                                onClick={() => onDelete(comment.id)}
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