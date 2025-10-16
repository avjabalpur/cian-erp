import { Metadata } from 'next';
import { ItemManagement } from '@/modules/masters/items';

export const metadata: Metadata = {
  title: 'Items Master | Pharma ERP',
  description: 'Manage items master data',
};

export default function ItemsPage() {
  return <ItemManagement />;
}
