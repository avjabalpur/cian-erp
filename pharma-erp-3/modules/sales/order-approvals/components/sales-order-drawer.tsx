'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { SalesOrderApprovalContent } from './sales-order-approval-content';

interface SalesOrderDrawerProps {
  salesOrderId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SalesOrderDrawer({
  salesOrderId,
  open,
  onOpenChange,
  onSuccess
}: SalesOrderDrawerProps) {
  if (!salesOrderId) {
    return null;
  }

  return (
    <RightDrawer 
      open={open} 
      onOpenChange={onOpenChange} 
      title={`Sales Order Approval | ${salesOrderId}`}
      size="full"
    >
      <SalesOrderApprovalContent
        salesOrderId={salesOrderId}
        isPageMode={false}
        onClose={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </RightDrawer>
  );
}

