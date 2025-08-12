"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Eye, Trash2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useQuotations } from "@/hooks/quotations/use-quotations";
import { useDeleteQuotation } from "@/hooks/quotations/use-delete-quotation";
import { Quotation } from "@/types/quotation";

interface QuotationTableProps {
  searchQuery: string;
}

export function QuotationTable({ searchQuery }: QuotationTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: quotations = [], isLoading, refetch } = useQuotations();
  const deleteQuotationMutation = useDeleteQuotation();

  const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    if (quotations) {
      const filtered = quotations.filter((quotation) =>
        quotation.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quotation.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quotation.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredQuotations(filtered);
    }
  }, [quotations, searchQuery]);

  const handleView = (id: number) => {
    router.push(`/quotations/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/quotations/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuotationMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Quotation deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete quotation",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading quotations...</span>
      </div>
    );
  }

  if (filteredQuotations.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations found</h3>
        <p className="text-gray-500">
          {searchQuery ? "Try adjusting your search terms." : "Get started by creating your first quotation."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quotation #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Advance %</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell>{quotation.companyName || "-"}</TableCell>
              <TableCell>{quotation.customerName || "-"}</TableCell>
              <TableCell>{quotation.customerContactPerson || "-"}</TableCell>
              <TableCell>
                {quotation.totalAmount ? formatCurrency(quotation.totalAmount) : "-"}
              </TableCell>
              <TableCell>
                {quotation.advancePercentage ? `${quotation.advancePercentage}%` : "-"}
              </TableCell>
              <TableCell>
                <Badge variant="outline">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(quotation.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(quotation.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(quotation.id)}
                    disabled={deleteQuotationMutation.isPending}
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
