import { Metadata } from 'next';
import { ConfigSettingManagement } from '@/modules/configuration/config-settings';

export const metadata: Metadata = {
  title: 'Config Settings | Pharma ERP',
  description: 'Manage configuration settings',
};

export default function ConfigSettingsPage() {
  return <ConfigSettingManagement />;
}

