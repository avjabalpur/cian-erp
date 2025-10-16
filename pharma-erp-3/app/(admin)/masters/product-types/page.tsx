import { ProductTypeManagement } from "@/modules/masters/product-types";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Product Type Management",
  description: "Manage product types and categories",
}

export default function ProductTypesPage() {
  return <ProductTypeManagement />;
}
