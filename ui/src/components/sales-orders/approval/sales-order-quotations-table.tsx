"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit } from "lucide-react";
import { useQuotationsBySalesOrder } from "@/hooks/sales-order/use-sales-order-quotation";
import { SalesOrderQuotation } from "@/types/sales-order-extended";

interface SalesOrderQuotationsTableProps {
  salesOrderId: number;
  onCreateQuotation?: () => void;
  onViewQuotation?: (quotation: SalesOrderQuotation) => void;
  onEditQuotation?: (quotation: SalesOrderQuotation) => void;
}

export function SalesOrderQuotationsTable({
  salesOrderId,
  onCreateQuotation,
  onViewQuotation,
  onEditQuotation,
}: SalesOrderQuotationsTableProps) {
  const { data: quotations = [], isLoading, error } = useQuotationsBySalesOrder(salesOrderId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading quotations...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <p className="text-lg font-medium">Error loading quotations</p>
              <p className="text-sm text-muted-foreground">
                {error.message || "An error occurred while loading quotations"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Sales Order Quotations
            <Badge variant="secondary" className="bg-white/20 text-white">
              {quotations.length}
            </Badge>
          </CardTitle>
          {onCreateQuotation && (
            <Button
              size="sm"
              onClick={onCreateQuotation}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Quotation
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {quotations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              </div>
            </div>
            <p className="text-lg font-medium text-gray-500">No quotations found</p>
            <p className="text-sm text-gray-400 mb-4">
              No quotations have been created for this sales order yet
            </p>
            {onCreateQuotation && (
              <Button onClick={onCreateQuotation} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create First Quotation
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {quotations.map((quotation) => (
              <div
                key={quotation.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">
                        {quotation.quotationNumber}
                      </h3>
                      {quotation.quotationDate && (
                        <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                          {new Date(quotation.quotationDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <span className="ml-2 font-medium">{quotation.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Organization:</span>
                        <span className="ml-2 font-medium">{quotation.organizationName}</span>
                      </div>
                      {quotation.totalAmount && (
                        <div>
                          <span className="text-gray-500">Total Amount:</span>
                          <span className="ml-2 font-medium text-green-600">
                            ₹{quotation.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {quotation.advanceAmount && (
                        <div>
                          <span className="text-gray-500">Advance:</span>
                          <span className="ml-2 font-medium text-blue-600">
                            ₹{quotation.advanceAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {quotation.createdByName && (
                      <div className="mt-2 text-xs text-gray-500">
                        Created by {quotation.createdByName} on{" "}
                        {quotation.createdAt ? new Date(quotation.createdAt).toLocaleString() : "Unknown"}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {onViewQuotation && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewQuotation(quotation)}
                        className="h-8 px-3"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEditQuotation && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditQuotation(quotation)}
                        className="h-8 px-3"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
