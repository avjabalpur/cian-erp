
import { RoleManagement } from "@/components/administrator/role/role-management"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Role Management",
  description: "Manage system roles",
}
export default function RolesPage() {

  return <RoleManagement />;
}

