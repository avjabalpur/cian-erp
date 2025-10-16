import { Metadata } from 'next';
import { CustomerManagement } from '@/modules/masters/customers';

export const metadata: Metadata = {
  title: 'Customers | Pharma ERP',
  description: 'Manage customers',
};

export default function CustomersPage() {
  return <CustomerManagement />;
}
