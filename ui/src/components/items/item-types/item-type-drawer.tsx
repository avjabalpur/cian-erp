"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCreateItemType, useUpdateItemType } from "@/hooks/items/use-item-types";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormTextarea } from "@/components/shared/forms/form-textarea";
import { RightDrawer } from "@/components/shared/right-drawer";
import { ItemTypeFormData, itemTypeSchema } from "@/validations/item-master";
import { ItemType } from "@/types/item";

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
      console.log('Setting form values for edit:', itemType);
      reset({
        code: itemType.code || "",
        name: itemType.name || "",
        description: itemType.description || "",
        parentTypeId: itemType.parentTypeId || undefined,
        isActive: itemType.isActive ?? true,
      });
    } else {
      console.log('Setting form values for create');
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
    console.log('Form submitted with data:', data);
    console.log('Current itemType:', itemType);
    
    try {
      const payload = {
        code: data.code,
        name: data.name,
        description: data.description,
        parentTypeId: data.parentTypeId,
        isActive: data.isActive,
      };

      console.log('Payload to be sent:', payload);

      if (itemType) {
        console.log('Updating item type with ID:', itemType.id);
        const result = await updateItemTypeMutation.mutateAsync({
          id: itemType.id,
          data: payload,
        });
        console.log('Update result:', result);
        toast({
          title: "Success",
          description: "Item type updated successfully",
        });
      } else {
        console.log('Creating new item type');
        const result = await createItemTypeMutation.mutateAsync(payload);
        console.log('Create result:', result);
        toast({
          title: "Success",
          description: "Item type created successfully",
        });
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Item type operation failed:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data
      });
      
      // Handle specific error cases
      let errorMessage = itemType 
        ? "Failed to update item type" 
        : "Failed to create item type";
      
      if (error?.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error?.response?.status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
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

  // Debug form state
  console.log('Form errors:', errors);
  console.log('Form isSubmitting:', isSubmitting);
  console.log('Mutation states:', {
    createPending: createItemTypeMutation.isPending,
    updatePending: updateItemTypeMutation.isPending,
    isLoading
  });

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Active Status</label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this item type
              </p>
            </div>
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
          </div>

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