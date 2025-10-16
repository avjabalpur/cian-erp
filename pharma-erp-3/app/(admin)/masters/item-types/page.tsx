import { ItemTypeManagement } from "@/modules/masters/item-types";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Item Type Management",
  description: "Manage item types and categories",
}

export default function ItemTypesPage() {
  return <ItemTypeManagement />;
}
