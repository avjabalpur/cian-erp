"use client";

import { useState } from "react";
import ProductTypesList from "./product-types-list";
import ProductTypeDrawer from "./product-type-drawer";
import { ProductType } from "@/types/product-type";

export default function ProductTypesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);

  const handleCreate = () => {
    setSelectedProductType(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (productType: ProductType) => {
    setSelectedProductType(productType);
    setIsDrawerOpen(true);
  };

  const handleClose = () => {
    setIsDrawerOpen(false);
    setSelectedProductType(null);
  };

  const handleSuccess = () => {
    // The drawer will close automatically after success
    // You can add any additional logic here if needed
  };

  return (
    <div className="container mx-auto p-6">
      <ProductTypesList onEdit={handleEdit} onCreate={handleCreate} />
      
      <ProductTypeDrawer
        isOpen={isDrawerOpen}
        onClose={handleClose}
        productType={selectedProductType}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 