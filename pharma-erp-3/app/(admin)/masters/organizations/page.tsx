import { OrganizationManagement } from "@/modules/masters/organizations";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Organization Management",
  description: "Manage organizational units",
}

export default function OrganizationsPage() {
  return <OrganizationManagement />;
}

