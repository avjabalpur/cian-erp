import { Metadata } from 'next';
import { SalesOrderApprovalContent } from '@/modules/sales/order-approvals/components/sales-order-approval-content';

export const metadata: Metadata = {
  title: 'Sales Order Approval Details | Pharma ERP',
  description: 'View and manage sales order approval details',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function SalesOrderApprovalDetailsPage({ params }: PageProps) {
  const salesOrderId = parseInt(params.id);

  if (isNaN(salesOrderId)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Sales Order ID</h1>
          <p className="text-muted-foreground">The provided sales order ID is not valid.</p>
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
