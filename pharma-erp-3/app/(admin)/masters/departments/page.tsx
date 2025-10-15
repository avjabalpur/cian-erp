import { DepartmentManagement } from "@/modules/masters/departments"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Department Management",
  description: "Manage organizational departments",
}

export default function DepartmentsPage() {
  return <DepartmentManagement />;
}

