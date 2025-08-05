"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProductTypes, useDeleteProductType } from "@/hooks/items/use-product-types";
import { ProductType } from "@/types/product-type";
import { useToast } from "@/hooks/use-toast";
import { ProductTypeDrawer } from "./product-type-drawer";
import ProductTypeTable from "./product-type-table";

export default function ProductTypeManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const { toast } = useToast();

  const { data: productTypes = [], isLoading } = useProductTypes();
  const deleteProductTypeMutation = useDeleteProductType();

  const handleEdit = (productType: ProductType) => {
    setSelectedProductType(productType);
    setDrawerOpen(true);
  };

  const handleDelete = async (productType: ProductType) => {
    try {
      await deleteProductTypeMutation.mutateAsync(productType.id);
      toast({
        title: "Success",
        description: "Product type deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete product type",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Product Type Management</h1>
        </div>
        <Button onClick={() => { setSelectedProductType(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product Type
        </Button>
      </div>
      <ProductTypeTable
        productTypes={productTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
      <ProductTypeDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productType={selectedProductType}
      />
    </div>
  );
} 