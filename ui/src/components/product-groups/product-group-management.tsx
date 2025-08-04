"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProductGroups, useDeleteProductGroup } from "@/hooks/use-product-groups";
import { useDivisions } from "@/hooks/use-divisions";
import { ProductGroup } from "@/types/product-group";
import { useToast } from "@/hooks/use-toast";
import { ProductGroupDrawer } from "./product-group-drawer";
import ProductGroupTable from "./product-group-table";

export default function ProductGroupManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProductGroup, setSelectedProductGroup] = useState<ProductGroup | null>(null);
  const { toast } = useToast();

  const { data: productGroups = [], isLoading } = useProductGroups();
  const { data: divisions = [] } = useDivisions();
  const deleteProductGroupMutation = useDeleteProductGroup();

  const handleEdit = (productGroup: ProductGroup) => {
    setSelectedProductGroup(productGroup);
    setDrawerOpen(true);
  };

  const handleDelete = async (productGroup: ProductGroup) => {
    try {
      await deleteProductGroupMutation.mutateAsync(productGroup.id);
      toast({
        title: "Success",
        description: "Product group deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete product group",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Group Management</h1>
          <p className="mt-2 text-gray-600">Manage system product groups</p>
        </div>
        <Button onClick={() => { setSelectedProductGroup(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product Group
        </Button>
      </div>
      <ProductGroupTable
        productGroups={productGroups}
        divisions={divisions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
      <ProductGroupDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productGroup={selectedProductGroup}
        divisions={divisions}
      />
    </div>
  );
} 