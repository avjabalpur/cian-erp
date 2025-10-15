import { DivisionManagement } from "@/modules/masters/divisions";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Division Management",
  description: "Manage organizational divisions",
}

export default function DivisionsPage() {
  return <DivisionManagement />;
}

