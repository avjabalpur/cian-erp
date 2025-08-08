"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductTypes, useDeleteProductType } from "@/hooks/items/use-product-types";
import { ProductType } from "@/types/product-type";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductTypesListProps {
  onEdit: (productType: ProductType) => void;
  onCreate: () => void;
}

export default function ProductTypesList({ onEdit, onCreate }: ProductTypesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productTypeToDelete, setProductTypeToDelete] = useState<ProductType | null>(null);
  
  const { data: productTypes = [], isLoading } = useProductTypes();
  const deleteProductTypeMutation = useDeleteProductType();
  const { toast } = useToast();

  const filteredProductTypes = productTypes.filter((productType) =>
    productType.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    productType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    productType.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (productType: ProductType) => {
    setProductTypeToDelete(productType);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productTypeToDelete) return;

    try {
      await deleteProductTypeMutation.mutateAsync(productTypeToDelete.id);
      toast({
        title: "Success",
        description: "Product type deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete product type",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductTypeToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Types</h2>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product Type
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search product types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredProductTypes.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {searchTerm ? "No product types found matching your search." : "No product types found."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredProductTypes.map((productType) => (
            <Card key={productType.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {productType.code} - {productType.name}
                      <Badge variant={productType.isActive ? "default" : "secondary"}>
                        {productType.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    {productType.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {productType.description}
                      </p>
                    )}
                    {productType.parentType && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Parent: {productType.parentType.code} - {productType.parentType.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(productType)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(productType)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product type{" "}
              <strong>{productTypeToDelete?.code} - {productTypeToDelete?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 