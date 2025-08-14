"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateProductType, useProductTypes, useUpdateProductType } from "@/hooks/items/use-product-types";
import { FormInput } from "@/components/shared/forms/form-input";
import { RightDrawer } from "@/components/shared/right-drawer";
import { ProductTypeFormData, productTypeSchema } from "@/validations/product-type";
import { ProductType } from "@/types/product-type";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { FormSelect } from "@/components/shared/forms/form-select";
import { useProductTypeOptions } from "@/components/shared/options";

interface ProductTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productType?: ProductType | null;
  onSuccess: () => void;
}

export default function ProductTypeDrawer({
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

  const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = form;

  useEffect(() => {
    if (productType) {
      reset({
        code: productType.code || "",
        name: productType.name || "",
        description: productType.description || "",
        parentTypeId: productType.parentTypeId || undefined,
        isActive: productType.isActive ?? true,
      });
    } else {
      reset({
        code: "",
        name: "",
        description: "",
        parentTypeId: undefined,
        isActive: true,
      });
    }
  }, [productType, reset]);

  const productTypeOptions = useProductTypeOptions();

  const onSubmit = async (data: ProductTypeFormData) => {
    try {
      const payload = {
        code: data.code,
        name: data.name,
        description: data.description,
        parentTypeId: data.parentTypeId,
        isActive: data.isActive,
      };

      if (productType) {
        const result = await updateProductTypeMutation.mutateAsync({
          id: productType.id,
          data: payload,
        });
        toast({
          title: "Success",
          description: "Product type updated successfully",
        });
      } else {
        const result = await createProductTypeMutation.mutateAsync(payload);
        toast({
          title: "Success",
          description: "Product type created successfully",
        });
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      // Handle specific error cases
      let errorMessage = productType 
        ? "Failed to update product type" 
        : "Failed to create product type";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isLoading = createProductTypeMutation.isPending || updateProductTypeMutation.isPending;
  
  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={productType ? "Edit Product Type" : "Create New Product Type"}
      description={productType 
        ? "Update the product type information below." 
        : "Fill in the information below to create a new product type."
      }
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <FormSelect
            control={control}
            name="parentTypeId"
            label="Parent Product Type"
            options={productTypeOptions}
          />

          <FormInput
            control={control}
            name="code"
            label="Code"
            placeholder="Enter product type code"
            required
          />

          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Enter product type name"
            required
          />

          <FormTextArea
            control={control}
            name="description"
            label="Description"
            placeholder="Enter product type description"
          />

          <FormCheckbox
            control={control}
            name="isActive"
            label="Active Status"
            inline={true}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "Saving..." : productType ? "Update Product Type" : "Create Product Type"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
} 