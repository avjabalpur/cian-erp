import { Metadata } from 'next';
import { SalesDashboard } from '@/components/sales/sales-dashboard';

export const metadata: Metadata = {
  title: 'Sales Dashboard | Pharma ERP',
  description: 'Sales operations dashboard and overview',
};

export default function SalesPage() {
  return <SalesDashboard />;
}
