import { PermissionManagement } from "@/components/administrator/permission/permission-management"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Permission Management",
  description: "Manage system permissions",
}
export default function PermissionsPage() {   
  return <PermissionManagement />;
}

