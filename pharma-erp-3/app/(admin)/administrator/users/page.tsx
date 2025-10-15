
import { UserManagement } from '@/components/administrator/user/user-management';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage system users, roles, and access",
}
export default function UsersPage() {
  return <UserManagement />;
}

