"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateProductGroup, useUpdateProductGroup } from "@/hooks/items/use-product-groups";
import { RightDrawer } from "@/components/shared/right-drawer";
import { ProductGroupForm } from "./product-group-form";
import { ProductGroup, CreateProductGroupData, UpdateProductGroupData } from "@/types/product-group";
import { ProductGroupFormData, productGroupSchema } from "@/validations/product-group";

interface ProductGroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productGroup?: ProductGroup | null;
  divisions?: any[];
  onSuccess?: () => void;
}

export function ProductGroupDrawer({
  isOpen,
  onClose,
  productGroup,
  divisions = [],
  onSuccess,
}: ProductGroupDrawerProps) {
  const { toast } = useToast();
  const createProductGroupMutation = useCreateProductGroup();
  const updateProductGroupMutation = useUpdateProductGroup();

  const form = useForm<ProductGroupFormData>({
    resolver: zodResolver(productGroupSchema),
    defaultValues: {
      code: "",
      level: "",
      productGroupName: "",
      unit: "NOS",
      salesDivisionCode: undefined,
      uomForMls: "NOS",
      conversionFactor: 1.00000000,
      conversionFactorUnit: "NOS/NOS",
      costCentreCode: "",
      isClosed: false,
      revNo: "00938",
      isActive: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (productGroup) {
        form.reset({
          code: productGroup.code,
          level: productGroup.level,
          productGroupName: productGroup.productGroupName,
          unit: productGroup.unit,
          salesDivisionCode: productGroup.salesDivisionCode,
          uomForMls: productGroup.uomForMls,
          conversionFactor: productGroup.conversionFactor,
          conversionFactorUnit: productGroup.conversionFactorUnit,
          costCentreCode: productGroup.costCentreCode || "",
          isClosed: productGroup.isClosed,
          revNo: productGroup.revNo,
          isActive: productGroup.isActive,
        });
      } else {
        form.reset({
          code: "",
          level: "",
          productGroupName: "",
          unit: "NOS",
          salesDivisionCode: undefined,
          uomForMls: "NOS",
          conversionFactor: 1.00000000,
          conversionFactorUnit: "NOS/NOS",
          costCentreCode: "",
          isClosed: false,
          revNo: "00938",
          isActive: false,
        });
      }
    }
  }, [productGroup, form, isOpen]);

  const onSubmit = async (data: ProductGroupFormData) => {
    try {
      if (productGroup) {
        const updateData: UpdateProductGroupData = {
          code: data.code,
          level: data.level,
          productGroupName: data.productGroupName,
          unit: data.unit,
          salesDivisionCode: data.salesDivisionCode,
          uomForMls: data.uomForMls,
          conversionFactor: data.conversionFactor,
          conversionFactorUnit: data.conversionFactorUnit,
          costCentreCode: data.costCentreCode || undefined,
          isClosed: data.isClosed,
          revNo: data.revNo,
          isActive: data.isActive,
        };

        await updateProductGroupMutation.mutateAsync({
          id: productGroup.id,
          data: updateData,
        });

        toast({
          title: "Success",
          description: "Product group updated successfully",
        });
      } else {
        const createData: CreateProductGroupData = {
          code: data.code,
          level: data.level,
          productGroupName: data.productGroupName,
          unit: data.unit,
          salesDivisionCode: data.salesDivisionCode,
          uomForMls: data.uomForMls,
          conversionFactor: data.conversionFactor,
          conversionFactorUnit: data.conversionFactorUnit,
          costCentreCode: data.costCentreCode || undefined,
          isClosed: data.isClosed,
          revNo: data.revNo,
          isActive: data.isActive,
        };

        await createProductGroupMutation.mutateAsync(createData);

        toast({
          title: "Success",
          description: "Product group created successfully",
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

  const isLoading = createProductGroupMutation.isPending || updateProductGroupMutation.isPending;

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={productGroup ? "Edit Product Group" : "Create New Product Group"}
      description={
        productGroup
          ? "Update the product group information below."
          : "Fill in the information below to create a new product group."
      }
      size="2xl"
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ProductGroupForm control={form.control} divisions={divisions} />

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : productGroup
                ? "Update Product Group"
                : "Create Product Group"}
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