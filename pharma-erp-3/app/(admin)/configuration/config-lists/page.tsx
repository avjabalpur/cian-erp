import { Metadata } from 'next';
import { ConfigListManagement } from '@/modules/configuration/config-lists';

export const metadata: Metadata = {
  title: 'Config Lists | Pharma ERP',
  description: 'Manage configuration lists',
};

export default function ConfigListsPage() {
  return <ConfigListManagement />;
}

