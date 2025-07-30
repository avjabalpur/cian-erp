"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateItemType, useUpdateItemType } from "@/hooks/items/use-item-types";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormTextarea } from "@/components/shared/forms/form-textarea";
import { RightDrawer } from "@/components/shared/right-drawer";
import { ItemTypeFormData, itemTypeSchema } from "@/validations/item-master";
import { ItemType } from "@/types/item";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";

interface ItemTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itemType?: ItemType | null;
  onSuccess: () => void;
}

export default function ItemTypeDrawer({
  isOpen,
  onClose,
  itemType,
  onSuccess,
}: ItemTypeDrawerProps) {
  const { toast } = useToast();
  const createItemTypeMutation = useCreateItemType();
  const updateItemTypeMutation = useUpdateItemType();

  const form = useForm<ItemTypeFormData>({
    resolver: zodResolver(itemTypeSchema),
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
    if (itemType) {
      reset({
        code: itemType.code || "",
        name: itemType.name || "",
        description: itemType.description || "",
        parentTypeId: itemType.parentTypeId || undefined,
        isActive: itemType.isActive ?? true,
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
  }, [itemType, reset]);

  const onSubmit = async (data: ItemTypeFormData) => {
    
    try {
      const payload = {
        code: data.code,
        name: data.name,
        description: data.description,
        parentTypeId: data.parentTypeId,
        isActive: data.isActive,
      };


      if (itemType) {
        const result = await updateItemTypeMutation.mutateAsync({
          id: itemType.id,
          data: payload,
        });
        toast({
          title: "Success",
          description: "Item type updated successfully",
        });
      } else {
        const result = await createItemTypeMutation.mutateAsync(payload);
        toast({
          title: "Success",
          description: "Item type created successfully",
        });
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {

      
      // Handle specific error cases
      let errorMessage = itemType 
        ? "Failed to update item type" 
        : "Failed to create item type";
      
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

  const isLoading = createItemTypeMutation.isPending || updateItemTypeMutation.isPending;
  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={itemType ? "Edit Item Type" : "Create New Item Type"}
      description={itemType 
        ? "Update the item type information below." 
        : "Fill in the information below to create a new item type."
      }
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {JSON.stringify(errors)}
          <FormInput
            control={control}
            name="code"
            label="Code"
            placeholder="Enter item type code"
            required
          />

          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Enter item type name"
            required
          />

          <FormTextarea
            control={control}
            name="description"
            label="Description"
            placeholder="Enter item type description"
          />

          <FormInput
            control={control}
            name="parentTypeId"
            label="Parent Item Type ID"
            placeholder="Enter parent item type ID (optional)"
            inputProps={{ 
              type: "number",
              min: "1",
              step: "1"
            }}
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
              {isLoading ? "Saving..." : itemType ? "Update Item Type" : "Create Item Type"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
} 