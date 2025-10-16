import { Metadata } from 'next';
import { CustomerTypeManagement } from '@/modules/masters/customer-types';

export const metadata: Metadata = {
  title: 'Customer Types | Pharma ERP',
  description: 'Manage customer types',
};

export default function CustomerTypesPage() {
  return <CustomerTypeManagement />;
}

