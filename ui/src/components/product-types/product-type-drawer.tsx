"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateProductType, useUpdateProductType } from "@/hooks/items/use-product-types";
import { RightDrawer } from "@/components/shared/right-drawer";
import { ProductTypeForm } from "./product-type-form";
import { ProductType, CreateProductTypeData, UpdateProductTypeData } from "@/types/product-type";
import { ProductTypeFormData, productTypeSchema } from "@/validations/product-type";

interface ProductTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productType?: ProductType | null;
  onSuccess?: () => void;
}

export function ProductTypeDrawer({
  isOpen,
  onClose,
  productType,
  onSuccess,
}: ProductTypeDrawerProps) {
  const { toast } = useToast();
  const createProductTypeMutation = useCreateProductType();
  const updateProductTypeMutation = useUpdateProductType();

  const form = useForm<ProductTypeFormData>({
    resolver: zodResolver(productTypeSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      parentTypeId: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (productType) {
        form.reset({
          code: productType.code,
          name: productType.name,
          description: productType.description || "",
          parentTypeId: productType.parentTypeId?.toString() || undefined,
          isActive: productType.isActive,
        });
      } else {
        form.reset({
          code: "",
          name: "",
          description: "",
          parentTypeId: undefined,
          isActive: true,
        });
      }
    }
  }, [productType, form, isOpen]);

  const onSubmit = async (data: ProductTypeFormData) => {
    try {
      if (productType) {
        const updateData: UpdateProductTypeData = {
          code: data.code,
          name: data.name,
          description: data.description || undefined,
          parentTypeId: data.parentTypeId,
          isActive: data.isActive,
        };

        await updateProductTypeMutation.mutateAsync({
          id: productType.id,
          data: updateData,
        });

        toast({
          title: "Success",
          description: "Product type updated successfully",
        });
      } else {
        const createData: CreateProductTypeData = {
          code: data.code,
          name: data.name,
          description: data.description || undefined,
          parentTypeId: data.parentTypeId,
          isActive: data.isActive,
        };

        await createProductTypeMutation.mutateAsync(createData);

        toast({
          title: "Success",
          description: "Product type created successfully",
        });
      }
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = createProductTypeMutation.isPending || updateProductTypeMutation.isPending;

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={productType ? "Edit Product Type" : "Create New Product Type"}
      description={
        productType
          ? "Update the product type information below."
          : "Fill in the information below to create a new product type."
      }
      size="2xl"
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ProductTypeForm control={form.control} excludeId={productType?.id} />

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : productType
                ? "Update Product Type"
                : "Create Product Type"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
} 