"use client";

import { RightDrawer } from "@/components/shared/right-drawer";
import { SalesOrderApprovalContent } from "./sales-order-approval-content";

interface SalesOrderDrawerProps {
  salesOrderId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SalesOrderDrawer({
  salesOrderId,
  isOpen,
  onClose,
  onSuccess
}: SalesOrderDrawerProps) {
  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title={`Sales Order Approval | ${salesOrderId}`} size="full">
      <SalesOrderApprovalContent
        salesOrderId={salesOrderId}
        isPageMode={false}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </RightDrawer>
  );
} 