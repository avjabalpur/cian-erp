"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCreateItemOtherDetail, useUpdateItemOtherDetail } from "@/hooks/items/use-item-other-details";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormTextarea } from "@/components/shared/forms/form-textarea";
import { RightDrawer } from "@/components/shared/right-drawer";

const itemOtherDetailSchema = z.object({
  itemId: z.number().min(1, "Item ID is required"),
  detailName: z.string().min(1, "Detail name is required"),
  detailValue: z.string().optional(),
  detailType: z.string().min(1, "Detail type is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ItemOtherDetailFormData = z.infer<typeof itemOtherDetailSchema>;

interface ItemOtherDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itemOtherDetail?: any;
  itemId?: number;
  onSuccess: () => void;
}

export default function ItemOtherDetailsDrawer({
  isOpen,
  onClose,
  itemOtherDetail,
  itemId,
  onSuccess,
}: ItemOtherDetailsDrawerProps) {
  const { toast } = useToast();
  const createItemOtherDetailMutation = useCreateItemOtherDetail();
  const updateItemOtherDetailMutation = useUpdateItemOtherDetail();

  const form = useForm<ItemOtherDetailFormData>({
    resolver: zodResolver(itemOtherDetailSchema),
    defaultValues: {
      itemId: itemId || 0,
      detailName: "",
      detailValue: "",
      detailType: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (itemOtherDetail) {
      form.reset({
        itemId: itemOtherDetail.itemId || itemId || 0,
        detailName: itemOtherDetail.detailName || "",
        detailValue: itemOtherDetail.detailValue || "",
        detailType: itemOtherDetail.detailType || "",
        description: itemOtherDetail.description || "",
        isActive: itemOtherDetail.isActive ?? true,
      });
    } else {
      form.reset({
        itemId: itemId || 0,
        detailName: "",
        detailValue: "",
        detailType: "",
        description: "",
        isActive: true,
      });
    }
  }, [itemOtherDetail, itemId, form]);

  const onSubmit = async (data: ItemOtherDetailFormData) => {
    try {
      if (itemOtherDetail) {
        await updateItemOtherDetailMutation.mutateAsync({
          id: itemOtherDetail.id,
          data,
        });
        toast({
          title: "Success",
          description: "Item other detail updated successfully",
        });
      } else {
        await createItemOtherDetailMutation.mutateAsync(data);
        toast({
          title: "Success",
          description: "Item other detail created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: itemOtherDetail 
          ? "Failed to update item other detail" 
          : "Failed to create item other detail",
        variant: "destructive",
      });
    }
  };

  const isLoading = createItemOtherDetailMutation.isPending || updateItemOtherDetailMutation.isPending;

  const detailTypeOptions = [
    { label: "Select detail type", value: "" },
    { label: "Specification", value: "specification" },
    { label: "Ingredient", value: "ingredient" },
    { label: "Packaging", value: "packaging" },
    { label: "Storage", value: "storage" },
    { label: "Safety", value: "safety" },
    { label: "Regulatory", value: "regulatory" },
  ];

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={itemOtherDetail ? "Edit Item Other Detail" : "Create New Item Other Detail"}
      description={itemOtherDetail 
        ? "Update the item other detail information below." 
        : "Fill in the information below to create a new item other detail."
      }
    >
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            control={form.control}
            name="detailName"
            label="Detail Name"
            placeholder="Enter detail name"
            required
          />

          <FormSelect
            control={form.control}
            name="detailType"
            label="Detail Type"
            options={detailTypeOptions}
            required
          />

          <FormInput
            control={form.control}
            name="detailValue"
            label="Detail Value"
            placeholder="Enter detail value (optional)"
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter description (optional)"
          />

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Active Status</label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this detail
              </p>
            </div>
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : itemOtherDetail ? "Update Detail" : "Create Detail"}
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