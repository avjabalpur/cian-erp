"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCreateItem, useUpdateItem } from "@/hooks/items/use-items";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormTextarea } from "@/components/shared/forms/form-textarea";
import { RightDrawer } from "@/components/shared/right-drawer";
import ItemMediaSection from "../item-media/item-media-section";
import ItemOtherDetailsSection from "../item-other-details/item-other-details-section";
import ItemSalesDetailsSection from "../item-sales-details/item-sales-details-section";
import ItemStockAnalysisSection from "../item-stock-analysis/item-stock-analysis-section";

const itemSchema = z.object({
  itemCode: z.string().min(1, "Item Code is required"),
  itemName: z.string().min(1, "Item Name is required"),
  shortName: z.string().optional(),
  itemType: z.string().optional(),
  description: z.string().optional(),
  composition: z.string().optional(),
  dosageName: z.string().optional(),
  manufactured: z.boolean().default(false),
  qcRequired: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  onSuccess: () => void;
}

export default function ItemsDrawer({
  isOpen,
  onClose,
  item,
  onSuccess,
}: ItemsDrawerProps) {
  const { toast } = useToast();
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemCode: "",
      itemName: "",
      shortName: "",
      itemType: "",
      description: "",
      composition: "",
      dosageName: "",
      manufactured: false,
      qcRequired: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        itemCode: item.itemCode || "",
        itemName: item.itemName || "",
        shortName: item.shortName || "",
        itemType: item.itemType || "",
        description: item.description || "",
        composition: item.composition || "",
        dosageName: item.dosageName || "",
        manufactured: item.manufactured ?? false,
        qcRequired: item.qcRequired ?? false,
        isActive: item.isActive ?? true,
      });
    } else {
      form.reset({
        itemCode: "",
        itemName: "",
        shortName: "",
        itemType: "",
        description: "",
        composition: "",
        dosageName: "",
        manufactured: false,
        qcRequired: false,
        isActive: true,
      });
    }
  }, [item, form]);

  const onSubmit = async (data: ItemFormData) => {
    try {
      if (item) {
        await updateItemMutation.mutateAsync({
          id: item.id,
          data,
        });
        toast({
          title: "Success",
          description: "Item updated successfully",
        });
      } else {
        await createItemMutation.mutateAsync(data);
        toast({
          title: "Success",
          description: "Item created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: item 
          ? "Failed to update item" 
          : "Failed to create item",
        variant: "destructive",
      });
    }
  };

  const isLoading = createItemMutation.isPending || updateItemMutation.isPending;

  const itemTypeOptions = [
    { label: "Select item type", value: "" },
    { label: "Tablet", value: "tablet" },
    { label: "Capsule", value: "capsule" },
    { label: "Syrup", value: "syrup" },
    { label: "Injection", value: "injection" },
    { label: "Cream", value: "cream" },
    { label: "Ointment", value: "ointment" },
  ];

  return (
    <RightDrawer 
      isOpen={isOpen} 
      onClose={onClose}
      title={item ? "Edit Item" : "Create New Item"}
      description={item 
        ? "Update the item information below." 
        : "Fill in the information below to create a new item."
      }
    >
      <div className="mx-auto w-full max-w-4xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="details">Other Details</TabsTrigger>
              <TabsTrigger value="sales">Sales Details</TabsTrigger>
              <TabsTrigger value="stock">Stock Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  control={form.control}
                  name="itemCode"
                  label="Item Code"
                  placeholder="Enter item code"
                  required
                />

                <FormInput
                  control={form.control}
                  name="itemName"
                  label="Item Name"
                  placeholder="Enter item name"
                  required
                />
              </div>

              <FormInput
                control={form.control}
                name="shortName"
                label="Short Name"
                placeholder="Enter short name (optional)"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  control={form.control}
                  name="itemType"
                  label="Item Type"
                  options={itemTypeOptions}
                />

                <FormInput
                  control={form.control}
                  name="dosageName"
                  label="Dosage"
                  placeholder="Enter dosage (e.g., 500mg)"
                />
              </div>

              <FormTextarea
                control={form.control}
                name="composition"
                label="Composition"
                placeholder="Enter composition details"
              />

              <FormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="Enter item description"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Manufactured</label>
                    <p className="text-sm text-muted-foreground">
                      Is this item manufactured in-house?
                    </p>
                  </div>
                  <Switch
                    checked={form.watch("manufactured")}
                    onCheckedChange={(checked) => form.setValue("manufactured", checked)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">QC Required</label>
                    <p className="text-sm text-muted-foreground">
                      Does this item require quality control testing?
                    </p>
                  </div>
                  <Switch
                    checked={form.watch("qcRequired")}
                    onCheckedChange={(checked) => form.setValue("qcRequired", checked)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Active Status</label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable this item
                    </p>
                  </div>
                  <Switch
                    checked={form.watch("isActive")}
                    onCheckedChange={(checked) => form.setValue("isActive", checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <ItemMediaSection itemId={item?.id} />
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <ItemOtherDetailsSection itemId={item?.id} />
            </TabsContent>

            <TabsContent value="sales" className="space-y-6">
              <ItemSalesDetailsSection itemId={item?.id} />
            </TabsContent>

            <TabsContent value="stock" className="space-y-6">
              <ItemStockAnalysisSection itemId={item?.id} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : item ? "Update Item" : "Create Item"}
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