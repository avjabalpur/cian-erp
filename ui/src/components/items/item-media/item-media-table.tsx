"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Download, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils/sales-order-utils";

interface ItemMedia {
  id: number;
  itemId: number;
  itemName?: string;
  fileName: string;
  filePath: string;
  fileSize?: number;
  mediaType: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

interface ItemMediaTableProps {
  itemMedia: ItemMedia[];
  isLoading: boolean;
  onEdit: (media: ItemMedia) => void;
  onDelete: (id: number) => void;
}

export default function ItemMediaTable({
  itemMedia,
  isLoading,
  onEdit,
  onDelete,
}: ItemMediaTableProps) {
  const [sortField, setSortField] = useState<keyof ItemMedia>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof ItemMedia) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedItemMedia = [...itemMedia].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return sortDirection === "asc" 
        ? (aValue === bValue ? 0 : aValue ? -1 : 1)
        : (aValue === bValue ? 0 : aValue ? 1 : -1);
    }

    return 0;
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "-";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (itemMedia.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No item media found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("fileName")}
            >
              File Name
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("mediaType")}
            >
              Media Type
            </TableHead>
            <TableHead>File Size</TableHead>
            <TableHead>Description</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("isActive")}
            >
              Status
            </TableHead>
            <TableHead>Created By</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("createdAt")}
            >
              Created Date
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItemMedia.map((media) => (
            <TableRow key={media.id}>
              <TableCell className="font-medium">
                {media.itemName || `Item ${media.itemId}`}
              </TableCell>
              <TableCell className="font-medium font-mono">{media.fileName}</TableCell>
              <TableCell>
                <Badge variant="outline">{media.mediaType}</Badge>
              </TableCell>
              <TableCell>{formatFileSize(media.fileSize)}</TableCell>
              <TableCell className="max-w-xs truncate">
                {media.description || "-"}
              </TableCell>
              <TableCell>
                <Badge variant={media.isActive ? "default" : "secondary"}>
                  {media.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{media.createdByName || "-"}</TableCell>
              <TableCell>{formatDate(media.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(media.filePath, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = media.filePath;
                      link.download = media.fileName;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(media)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(media.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 