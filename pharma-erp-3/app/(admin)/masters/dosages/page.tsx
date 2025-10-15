import { DosageManagement } from "@/modules/masters/dosages";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dosage Management",
  description: "Manage pharmaceutical dosage forms",
}

export default function DosagesPage() {
  return <DosageManagement />;
}

