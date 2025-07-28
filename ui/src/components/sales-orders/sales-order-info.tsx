"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SalesOrder } from "@/types/sales-order";
import { format } from "date-fns";

interface SalesOrderInfoProps {
  salesOrder: SalesOrder;
}

export function SalesOrderInfo({ salesOrder }: SalesOrderInfoProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(num);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">SO Number</label>
              <p className="font-semibold">{salesOrder.soNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">SO Date</label>
              <p>{formatDate(salesOrder.soDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge variant={salesOrder.soStatus === "new" ? "default" : "secondary"}>
                {salesOrder.soStatus}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Term</label>
              <p>{salesOrder.paymentTerm}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer</label>
              <p className="font-semibold">{salesOrder.customerName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Organization</label>
              <p>{salesOrder.organizationId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Division</label>
              <p>{salesOrder.divisionName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Assigned Designer</label>
              <p>{salesOrder.assignedDesignerName || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Item</label>
              <p className="font-semibold">{salesOrder.itemName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dosage</label>
              <p>{salesOrder.dosageName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Composition</label>
              <p>{salesOrder.composition}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Pack Short</label>
              <p>{salesOrder.packShort}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tablet Type</label>
              <p>{salesOrder.tabletType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tablet Size</label>
              <p>{salesOrder.tabletSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Quantity</label>
              <p className="font-semibold">{salesOrder.quantity}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">FOC Quantity</label>
              <p>{salesOrder.focQty}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">MRP</label>
              <p className="font-semibold text-green-600">{formatCurrency(salesOrder.mrp)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Billing Rate</label>
              <p className="font-semibold text-blue-600">{formatCurrency(salesOrder.billingRate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Costing</label>
              <p>{formatCurrency(salesOrder.costing)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Inventory Charges</label>
              <p>{formatCurrency(salesOrder.inventoryCharges)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Design Under</label>
              <p>{salesOrder.designUnder}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Status</label>
              <p>{salesOrder.currentStatus}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">HSN Code</label>
              <p>{salesOrder.hsnCode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Drug Approval Under</label>
              <p>{salesOrder.drugApprovalUnder}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Comments</label>
            <p className="mt-1 text-sm">{salesOrder.comments || "No comments"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Audit Information */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Audit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created By</label>
              <p>{salesOrder.createdByName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p>{formatDate(salesOrder.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated By</label>
              <p>{salesOrder.updatedByName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p>{formatDate(salesOrder.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 