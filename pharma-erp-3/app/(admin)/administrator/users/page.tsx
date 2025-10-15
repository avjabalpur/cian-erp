
import { UserManagement } from '@/modules/administrator/users';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage system users, roles, and access",
}

export default function UsersPage() {
  return <UserManagement />;
}

