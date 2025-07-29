"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCreateItemSalesDetail, useUpdateItemSalesDetail } from "@/hooks/items/use-item-sales-details";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { RightDrawer } from "@/components/shared/right-drawer";

const itemSalesDetailSchema = z.object({
  itemId: z.number().min(1, "Item ID is required"),
  salesPrice: z.number().min(0, "Sales price must be positive"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  margin: z.number().min(0).max(100, "Margin must be between 0 and 100"),
  currency: z.string().min(1, "Currency is required"),
  effectiveDate: z.string().min(1, "Effective date is required"),
  expiryDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ItemSalesDetailFormData = z.infer<typeof itemSalesDetailSchema>;

interface ItemSalesDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itemSalesDetail?: any;
  itemId?: number;
  onSuccess: () => void;
}

export default function ItemSalesDetailsDrawer({
  isOpen,
  onClose,
  itemSalesDetail,
  itemId,
  onSuccess,
}: ItemSalesDetailsDrawerProps) {
  const { toast } = useToast();
  const createItemSalesDetailMutation = useCreateItemSalesDetail();
  const updateItemSalesDetailMutation = useUpdateItemSalesDetail();

  const form = useForm<ItemSalesDetailFormData>({
    resolver: zodResolver(itemSalesDetailSchema),
    defaultValues: {
      itemId: itemId || 0,
      salesPrice: 0,
      costPrice: 0,
      margin: 0,
      currency: "",
      effectiveDate: "",
      expiryDate: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (itemSalesDetail) {
      form.reset({
        itemId: itemSalesDetail.itemId || itemId || 0,
        salesPrice: itemSalesDetail.salesPrice || 0,
        costPrice: itemSalesDetail.costPrice || 0,
        margin: itemSalesDetail.margin || 0,
        currency: itemSalesDetail.currency || "",
        effectiveDate: itemSalesDetail.effectiveDate || "",
        expiryDate: itemSalesDetail.expiryDate || "",
        isActive: itemSalesDetail.isActive ?? true,
      });
    } else {
      form.reset({
        itemId: itemId || 0,
        salesPrice: 0,
        costPrice: 0,
        margin: 0,
        currency: "",
        effectiveDate: "",
        expiryDate: "",
        isActive: true,
      });
    }
  }, [itemSalesDetail, itemId, form]);

  const onSubmit = async (data: ItemSalesDetailFormData) => {
    try {
      if (itemSalesDetail) {
        await updateItemSalesDetailMutation.mutateAsync({
          id: itemSalesDetail.id,
          data,
        });
        toast({
          title: "Success",
          description: "Item sales detail updated successfully",
        });
      } else {
        await createItemSalesDetailMutation.mutateAsync(data);
        toast({
          title: "Success",
          description: "Item sales detail created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: itemSalesDetail 
          ? "Failed to update item sales detail" 
          : "Failed to create item sales detail",
        variant: "destructive",
      });
    }
  };

  const isLoading = createItemSalesDetailMutation.isPending || updateItemSalesDetailMutation.isPending;

  const currencyOptions = [
    { label: "Select currency", value: "" },
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" },
    { label: "INR", value: "INR" },
    { label: "CAD", value: "CAD" },
    { label: "AUD", value: "AUD" },
  ];

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={itemSalesDetail ? "Edit Item Sales Detail" : "Create New Item Sales Detail"}
      description={itemSalesDetail 
        ? "Update the item sales detail information below." 
        : "Fill in the information below to create a new item sales detail."
      }
    >
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="salesPrice"
              label="Sales Price"
              placeholder="Enter sales price"
              inputProps={{ type: "number", step: "0.01" }}
              required
            />

            <FormInput
              control={form.control}
              name="costPrice"
              label="Cost Price"
              placeholder="Enter cost price"
              inputProps={{ type: "number", step: "0.01" }}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="margin"
              label="Margin (%)"
              placeholder="Enter margin percentage"
              inputProps={{ type: "number", step: "0.01", min: "0", max: "100" }}
              required
            />

            <FormSelect
              control={form.control}
              name="currency"
              label="Currency"
              options={currencyOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="effectiveDate"
              label="Effective Date"
              placeholder="YYYY-MM-DD"
              inputProps={{ type: "date" }}
              required
            />

            <FormInput
              control={form.control}
              name="expiryDate"
              label="Expiry Date"
              placeholder="YYYY-MM-DD"
              inputProps={{ type: "date" }}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Active Status</label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this sales detail
              </p>
            </div>
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : itemSalesDetail ? "Update Sales Detail" : "Create Sales Detail"}
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