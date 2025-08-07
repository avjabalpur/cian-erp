"use client";

import { useParams } from "next/navigation";
import { SalesOrderApprovalContent } from "@/components/sales-orders/approval/sales-order-approval-content";

export default function SalesOrderApprovalPage() {
  const params = useParams();
  const salesOrderId = parseInt(params.id as string);

  if (!salesOrderId || isNaN(salesOrderId)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Invalid sales order ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <SalesOrderApprovalContent 
        salesOrderId={salesOrderId}
        isPageMode={true}
      />
    </div>
  );
} 