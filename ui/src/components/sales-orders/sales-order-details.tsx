"use client";

import { useState } from "react";
import { useSalesOrderById } from "@/hooks/sales-order/use-sales-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, MessageSquare, Paperclip, CheckCircle, User, Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { SalesOrderInfo } from "./sales-order-info";
import { SalesOrderApprovalStages } from "./sales-order-approval-stages";
import { SalesOrderDocuments } from "./sales-order-documents-table";
import { SalesOrderComments } from "./sales-order-comments-table";
import { formatDate } from "@/lib/date-utils";

interface SalesOrderDetailsProps {
  salesOrderId: number;
}

export function SalesOrderDetails({ salesOrderId }: SalesOrderDetailsProps) {
  const router = useRouter();
  const { data: salesOrder, isLoading, error } = useSalesOrderById(salesOrderId.toString());

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sales order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !salesOrder) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load sales order details</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sales Orders
        </Button>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Order Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">#{salesOrder.id}</span>
                  <Badge variant={salesOrder.soStatus === "new" ? "default" : "secondary"}>
                    {salesOrder.soStatus}
                  </Badge>
                  {salesOrder.isSubmitted && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Submitted
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold mt-2">{salesOrder.soNumber}</CardTitle>
              <p className="text-muted-foreground">
                {salesOrder.customerName || "Unknown Customer"} - {salesOrder.itemName || "Unknown Item"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Assigned to: {salesOrder.assignedDesignerName || "Unassigned"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created: {formatDate(salesOrder.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Updated: {formatDate(salesOrder.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Status: {salesOrder.currentStatus || "Pending"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <SalesOrderComments salesOrderId={salesOrderId} />

          <SalesOrderDocuments salesOrderId={salesOrderId} />
        </div>

        {/* Right Column - Approval Stages */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Approval Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalesOrderApprovalStages salesOrderId={salesOrderId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 