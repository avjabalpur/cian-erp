import { Metadata } from 'next';
import { SalesOrderApprovalManagement } from '@/modules/sales/order-approvals';

export const metadata: Metadata = {
  title: 'Sales Order Approvals | Pharma ERP',
  description: 'Manage sales order approvals',
};

export default function SalesOrderApprovalsPage() {
  return <SalesOrderApprovalManagement />;
}

