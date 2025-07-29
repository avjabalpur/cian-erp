"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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

const itemTypeSchema = z.object({
  itemType: z.string().min(1, "Item Type is required"),
  description: z.string().optional(),
  parentItemTypeId: z.number().optional(),
  isActive: z.boolean().default(true),
});

type ItemTypeFormData = z.infer<typeof itemTypeSchema>;

interface ItemTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itemType?: any;
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
      itemType: "",
      description: "",
      parentItemTypeId: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (itemType) {
      form.reset({
        itemType: itemType.itemType || "",
        description: itemType.description || "",
        parentItemTypeId: itemType.parentItemTypeId || undefined,
        isActive: itemType.isActive ?? true,
      });
    } else {
      form.reset({
        itemType: "",
        description: "",
        parentItemTypeId: undefined,
        isActive: true,
      });
    }
  }, [itemType, form]);

  const onSubmit = async (data: ItemTypeFormData) => {
    try {
      if (itemType) {
        await updateItemTypeMutation.mutateAsync({
          id: itemType.id,
          data,
        });
        toast({
          title: "Success",
          description: "Item type updated successfully",
        });
      } else {
        await createItemTypeMutation.mutateAsync(data);
        toast({
          title: "Success",
          description: "Item type created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: itemType 
          ? "Failed to update item type" 
          : "Failed to create item type",
        variant: "destructive",
      });
    }
  };

  const isLoading = createItemTypeMutation.isPending || updateItemTypeMutation.isPending;

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={itemType ? "Edit Item Type" : "Create New Item Type"}
      description={itemType 
        ? "Update the item type information below." 
        : "Fill in the information below to create a new item type."
      }
    >
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            control={form.control}
            name="itemType"
            label="Item Type"
            placeholder="Enter item type name"
            required
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter item type description"
          />

          <FormInput
            control={form.control}
            name="parentItemTypeId"
            label="Parent Item Type ID"
            placeholder="Enter parent item type ID (optional)"
            inputProps={{ type: "number" }}
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

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : itemType ? "Update Item Type" : "Create Item Type"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </RightDrawer>
  );
} 