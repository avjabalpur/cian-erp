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

interface HsnCode {
  id: number;
  hsnCode: string;
  description?: string;
  hsnType?: string;
  taxRate?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

interface HsnMasterTableProps {
  hsnCodes: HsnCode[];
  isLoading: boolean;
  onEdit: (hsnCode: HsnCode) => void;
  onDelete: (id: number) => void;
}

export default function HsnMasterTable({
  hsnCodes,
  isLoading,
  onEdit,
  onDelete,
}: HsnMasterTableProps) {
  const [sortField, setSortField] = useState<keyof HsnCode>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof HsnCode) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedHsnCodes = [...hsnCodes].sort((a, b) => {
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

  if (hsnCodes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No HSN codes found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("hsnCode")}
            >
              HSN Code
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("hsnType")}
            >
              HSN Type
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("taxRate")}
            >
              Tax Rate (%)
            </TableHead>
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
          {sortedHsnCodes.map((hsnCode) => (
            <TableRow key={hsnCode.id}>
              <TableCell className="font-medium font-mono">{hsnCode.hsnCode}</TableCell>
              <TableCell className="max-w-xs truncate">
                {hsnCode.description || "-"}
              </TableCell>
              <TableCell>{hsnCode.hsnType || "-"}</TableCell>
              <TableCell>
                {hsnCode.taxRate !== undefined ? `${hsnCode.taxRate}%` : "-"}
              </TableCell>
              <TableCell>
                <Badge variant={hsnCode.isActive ? "default" : "secondary"}>
                  {hsnCode.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{hsnCode.createdByName || "-"}</TableCell>
              <TableCell>{formatDate(hsnCode.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(hsnCode)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(hsnCode.id)}
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