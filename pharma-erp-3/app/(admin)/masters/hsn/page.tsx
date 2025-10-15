import { HsnManagement } from "@/modules/masters/hsn";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "HSN Master Management",
  description: "Manage Harmonized System of Nomenclature (HSN) codes and tax rates",
}

export default function HsnMasterPage() {
  return <HsnManagement />;
}

