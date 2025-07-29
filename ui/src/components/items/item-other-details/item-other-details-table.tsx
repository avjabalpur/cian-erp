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
import { Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/sales-order-utils";

interface ItemOtherDetail {
  id: number;
  itemId: number;
  itemName?: string;
  detailName: string;
  detailValue?: string;
  detailType: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

interface ItemOtherDetailsTableProps {
  itemOtherDetails: ItemOtherDetail[];
  isLoading: boolean;
  onEdit: (detail: ItemOtherDetail) => void;
  onDelete: (id: number) => void;
}

export default function ItemOtherDetailsTable({
  itemOtherDetails,
  isLoading,
  onEdit,
  onDelete,
}: ItemOtherDetailsTableProps) {
  const [sortField, setSortField] = useState<keyof ItemOtherDetail>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof ItemOtherDetail) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedItemOtherDetails = [...itemOtherDetails].sort((a, b) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (itemOtherDetails.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No item other details found</p>
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
              onClick={() => handleSort("detailName")}
            >
              Detail Name
            </TableHead>
            <TableHead>Detail Value</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("detailType")}
            >
              Detail Type
            </TableHead>
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
          {sortedItemOtherDetails.map((detail) => (
            <TableRow key={detail.id}>
              <TableCell className="font-medium">
                {detail.itemName || `Item ${detail.itemId}`}
              </TableCell>
              <TableCell className="font-medium">{detail.detailName}</TableCell>
              <TableCell className="max-w-xs truncate">
                {detail.detailValue || "-"}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{detail.detailType}</Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {detail.description || "-"}
              </TableCell>
              <TableCell>
                <Badge variant={detail.isActive ? "default" : "secondary"}>
                  {detail.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{detail.createdByName || "-"}</TableCell>
              <TableCell>{formatDate(detail.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(detail)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(detail.id)}
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