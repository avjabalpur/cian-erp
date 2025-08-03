"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCreateItemMaster, useUpdateItemMaster } from "@/hooks/items/use-item-master";
import { RightDrawer } from "@/components/shared/right-drawer";
import { ItemBasicInfoForm } from "./forms/item-basic-info-form";
import { ItemManufacturingForm } from "./forms/item-manufacturing-form";
import { ItemSalesForm } from "./forms/item-sales-form";
import { ItemBoughtOutForm } from "./forms/item-bought-out-form";
import { ItemStockAnalysisForm } from "./forms/item-stock-analysis-form";
import { ItemExportForm } from "./forms/item-export-form";
import { ItemSpecificationsForm } from "./forms/item-specifications-form";
import { ItemOtherDetailsForm } from "./forms/item-other-details-form";
import { CreateItemMasterData, UpdateItemMasterData, ItemMaster } from "@/types/item-master";
import { ItemMasterFormData, itemMasterSchema } from "@/validations/item-master";
import { getItemMasterDefaultValues, mapItemToFormData, transformFormDataToApi } from "@/lib/utils/item-master-utils";

interface ItemsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ItemMaster | null;
  onSuccess: () => void;
}

export default function ItemsDrawer({
  isOpen,
  onClose,
  item,
  onSuccess,
}: ItemsDrawerProps) {
  const { toast } = useToast();
  const createItemMutation = useCreateItemMaster();
  const updateItemMutation = useUpdateItemMaster();

  const form = useForm<ItemMasterFormData>({
    resolver: zodResolver(itemMasterSchema),
    defaultValues: getItemMasterDefaultValues(),
  });

  useEffect(() => {
    if (isOpen) {
      if (item) {
        console.log('Loading item data:', item);
        const formData = mapItemToFormData(item);
        console.log('Mapped form data:', formData);
        form.reset(formData);
      } else {
        console.log('Resetting to default values');
        form.reset(getItemMasterDefaultValues());
      }
    }
  }, [item, form, isOpen]);

  // Force re-render of child components when item changes
  const [currentItemId, setCurrentItemId] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    setCurrentItemId(item?.id);
  }, [item?.id]);

  const onSubmit = async (data: ItemMasterFormData) => {
    try {
      console.log('Form data before transformation:', data);
      const transformedData = transformFormDataToApi(data);
      console.log('Transformed data:', transformedData);

      let createdItemId: number;

      if (item) {
        const result = await updateItemMutation.mutateAsync({
          id: item.id,
          data: transformedData as unknown as UpdateItemMasterData,
        });
        if (result) {
          createdItemId = item.id;
          toast({
            title: "Success",
            description: "Item updated successfully",
          });
        }
      } else {
        const result = await createItemMutation.mutateAsync(transformedData as unknown as CreateItemMasterData);
        if (result) {
          createdItemId = result.id;
          toast({
            title: "Success",
            description: "Item created successfully",
          });
        }
      }

      // TODO: Save related data (specifications, export details, etc.) here
      // For now, we'll just close the drawer
      onSuccess();
    } catch (error: any) {
      console.error('Item operation failed:', error);
      toast({
        title: "Error",
        description: error?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset(getItemMasterDefaultValues());
    onClose();
  };

  const isLoading = createItemMutation.isPending || updateItemMutation.isPending;

  return (
    <RightDrawer 
      isOpen={isOpen} 
      onClose={handleClose}
      title={item ? "Edit Item" : "Create New Item"}
      description={item 
        ? "Update the item information below." 
        : "Fill in the information below to create a new item."
      }
      size="5xl"
    >
      <div className="mx-auto w-full">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="bought-out">Bought Out</TabsTrigger>
                <TabsTrigger value="stock">Stock Analysis</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="other">Other Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-3">
                <ItemBasicInfoForm control={form.control} />
              </TabsContent>

              <TabsContent value="manufacturing" className="space-y-3">
                <ItemManufacturingForm control={form.control} itemId={currentItemId} />
              </TabsContent>

              <TabsContent value="sales" className="space-y-3">
                <ItemSalesForm control={form.control} itemId={currentItemId} />
              </TabsContent>

              <TabsContent value="bought-out" className="space-y-3">
                <ItemBoughtOutForm control={form.control} itemId={currentItemId} />
              </TabsContent>

              <TabsContent value="stock" className="space-y-3">
                <ItemStockAnalysisForm control={form.control} itemId={currentItemId} />
              </TabsContent>

              <TabsContent value="export" className="space-y-3">
                <ItemExportForm control={form.control} itemId={currentItemId} />
              </TabsContent>

              <TabsContent value="specifications" className="space-y-3">
                <ItemSpecificationsForm control={form.control} itemId={currentItemId} />
              </TabsContent>

              <TabsContent value="other" className="space-y-3">
                <ItemOtherDetailsForm control={form.control} itemId={currentItemId} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : item ? "Update Item" : "Create Item"}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </RightDrawer>
  );
} 