"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Plus, Search, Download, FileText, FileImage, FileVideo, FileAudio } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import type { SalesOrderDocument } from "@/types/sales-order-extended"
import { useDocumentsBySalesOrder } from "@/hooks/use-sales-order-extended"

interface SalesOrderDocumentsTableProps {
  salesOrderId?: number
  onView?: (document: SalesOrderDocument) => void
  onEdit?: (document: SalesOrderDocument) => void
  onDelete?: (id: number) => void
  onCreate?: () => void
  onDownload?: (document: SalesOrderDocument) => void
}

export default function SalesOrderDocumentsTable({
  salesOrderId,
  onView,
  onEdit,
  onDelete,
  onCreate,
  onDownload,
}: SalesOrderDocumentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: documents = [],
    isLoading,
    error,
  } = useDocumentsBySalesOrder(salesOrderId || 0)

  const filteredDocuments = documents.filter((document: SalesOrderDocument) =>
    document.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.fileType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.createdByName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="h-4 w-4" />
    
    const type = fileType.toLowerCase()
    if (type.includes('image') || type.includes('jpg') || type.includes('png') || type.includes('gif')) {
      return <FileImage className="h-4 w-4" />
    }
    if (type.includes('video') || type.includes('mp4') || type.includes('avi')) {
      return <FileVideo className="h-4 w-4" />
    }
    if (type.includes('audio') || type.includes('mp3') || type.includes('wav')) {
      return <FileAudio className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const getFileTypeBadge = (fileType?: string) => {
    if (!fileType) return <Badge variant="outline">Unknown</Badge>
    
    const type = fileType.toLowerCase()
    if (type.includes('pdf')) return <Badge variant="destructive">PDF</Badge>
    if (type.includes('doc') || type.includes('docx')) return <Badge variant="default">Word</Badge>
    if (type.includes('xls') || type.includes('xlsx')) return <Badge variant="secondary">Excel</Badge>
    if (type.includes('ppt') || type.includes('pptx')) return <Badge variant="outline">PowerPoint</Badge>
    if (type.includes('image')) return <Badge variant="outline">Image</Badge>
    return <Badge variant="outline">{fileType.toUpperCase()}</Badge>
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Loading documents...</CardDescription>
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
          <CardTitle>Documents</CardTitle>
          <CardDescription>Error loading documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-red-500">Error loading documents</p>
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
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              {salesOrderId
                ? "Documents for this sales order"
                : "All sales order documents"
              }
            </CardDescription>
          </div>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Document
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
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {searchTerm ? "No documents found matching your search" : "No documents found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document: SalesOrderDocument) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getFileIcon(document.fileType)}
                          <div className="max-w-[200px]">
                            <div className="truncate font-medium" title={document.fileName}>
                              {document.fileName}
                            </div>
                            <div className="text-xs text-muted-foreground truncate" title={document.filePath}>
                              {document.filePath}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {document.tag ? (
                          <Badge variant="outline">{document.tag}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {getFileTypeBadge(document.fileType)}
                      </TableCell>
                      <TableCell>{document.createdByName || "Unknown User"}</TableCell>
                      <TableCell>{formatDate(document.createdAt)}</TableCell>
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
                              <DropdownMenuItem onClick={() => onView(document)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onDownload && (
                              <DropdownMenuItem onClick={() => onDownload(document)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                            )}
                            {onEdit && !document.isDeleted && (
                              <DropdownMenuItem onClick={() => onEdit(document)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && !document.isDeleted && (
                              <DropdownMenuItem
                                onClick={() => onDelete(document.id)}
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