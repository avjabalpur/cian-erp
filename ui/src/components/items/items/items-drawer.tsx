"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCreateItemMaster, useUpdateItemMaster, useItemMasterById } from "@/hooks/items/use-item-master";

import { useCreateItemMedia, useUpdateItemMedia } from "@/hooks/items/use-item-media";
import { RightDrawer } from "@/components/shared/right-drawer";
import { ItemBasicInfoForm } from "./forms/item-basic-info-form";
import { ItemSalesForm } from "./forms/item-sales-form";
import { ItemBoughtOutForm } from "./forms/item-bought-out-form";
import { ItemStockAnalysisForm } from "./forms/item-stock-analysis-form";
import { ItemExportForm } from "./forms/item-export-form";
import { ItemSpecificationsForm } from "./forms/item-specifications-form";
import { ItemOtherDetailsForm } from "./forms/item-other-details-form";
import { ItemMediaForm } from "./forms/item-media-form";
import ItemCodeGenerator from "./forms/ItemCodeSequence";
import { KeyValueForm } from "@/components/shared/dynamic-form/dynamic-form";
import { CreateItemMasterData, UpdateItemMasterData, ItemMaster, UpdateItemSalesDetailData } from "@/types/item-master";
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
  const [generatedItemCode, setGeneratedItemCode] = useState<string>("");
  
  // Fetch complete item data when editing
  const { data: completeItemData, isLoading: isLoadingItem } = useItemMasterById(item?.id || 0);
  
  // Main item mutations
  const createItemMutation = useCreateItemMaster();
  const updateItemMutation = useUpdateItemMaster();
  
  // Media mutations (kept for separate file uploads)
  const createMediaMutation = useCreateItemMedia();
  const updateMediaMutation = useUpdateItemMedia();

  const form = useForm<ItemMasterFormData>({
    resolver: zodResolver(itemMasterSchema),
    defaultValues: getItemMasterDefaultValues(),
  });
 const onError = (errors: typeof form.formState.errors) => {
  const currentValues = form.getValues();
  console.log("❌ Errors:", errors);
  console.log("⚠️ Data at time of error:", currentValues);
};
  
  useEffect(() => {
    if (isOpen) {
      if (item) {
        // If we have a complete item data from the API, use it
        if (completeItemData) {
          console.log('Loading complete item data:', completeItemData);
          const formData = mapItemToFormData(completeItemData);
          console.log('Mapped form data:', formData);
          form.reset(formData);
        } else if (!isLoadingItem) {
          // Fallback to the item passed as prop if API data is not available
          console.log('Loading item data from prop:', item);
        const formData = mapItemToFormData(item);
        console.log('Mapped form data:', formData);
        form.reset(formData);
        }
      } else {
        console.log('Resetting to default values');
        form.reset(getItemMasterDefaultValues());
      }
    }
  }, [item, completeItemData, isLoadingItem, form, isOpen]);

  // Force re-render of child components when item changes
  const [currentItemId, setCurrentItemId] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    setCurrentItemId(item?.id);
  }, [item?.id]);

  // Removed saveRelatedData function - all related data is now included in the main payload via transformFormDataToApi

  const onSubmit = async (data: ItemMasterFormData) => {
    try {
      console.log('Form data before transformation:', data);
      const transformedData = transformFormDataToApi(data);
      console.log('Transformed data:', transformedData);

      let createdItemId: number = 0;

      if (item) {
        const result = await updateItemMutation.mutateAsync({
          id: item.id,
          data: {...transformedData, itemCode: generatedItemCode || item.itemCode} as unknown as UpdateItemMasterData,
        });
        if (result) {
          createdItemId = item.id;
          toast({
            title: "Success",
            description: "Item updated successfully",
          });
        }
      } else {
        const result = await createItemMutation.mutateAsync({...transformedData, itemCode: generatedItemCode} as unknown as CreateItemMasterData);
        if (result) {
          createdItemId = result.id;
          setCurrentItemId(result.id); // Set the currentItemId for new items
          toast({
            title: "Success",
            description: "Item created successfully",
          });
        }
      }

      // Remove the separate saveRelatedData call since all data is already included in transformedData
      // The transformFormDataToApi function includes all related data in the main payload

      onSuccess();
    } catch (error: any) {
      console.error('Item operation failed:', error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset(getItemMasterDefaultValues());
    onClose();
  };

  const isLoading = createItemMutation.isPending || updateItemMutation.isPending || isLoadingItem;

  return (
    <RightDrawer 
      isOpen={isOpen} 
      onClose={handleClose}
      size="full"
    >
      <div className="mx-auto w-full">
        {/* Custom Header with Item Code Generator */}
        <div className="flex items-start p-4 border-b bg-[#d1f2ff]">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {item ? "Edit Item" : "Create New Item"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {item 
                ? "Update the item information below." 
                : "Fill in the information below to create a new item."
              }
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <ItemCodeGenerator 
              onCodeGenerated={setGeneratedItemCode}
              initialValue={item?.itemCode}
            />
          </div>
          
          <div className="flex-1"></div>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit,onError)} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-9">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="bought-out">Bought Out</TabsTrigger>
                <TabsTrigger value="stock">Stock Analysis</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                {/* <TabsTrigger value="other">Other Details</TabsTrigger> */}
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-3">
                <ItemBasicInfoForm control={form.control} itemId={currentItemId} />
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

              {/* <TabsContent value="other" className="space-y-3">
                <ItemOtherDetailsForm control={form.control} itemId={currentItemId} />
              </TabsContent> */}

              <TabsContent value="media" className="space-y-3">
                <ItemMediaForm 
                  control={form.control} 
                  itemId={currentItemId} 
                  mediaData={completeItemData?.media}
                />
              </TabsContent>

              <TabsContent value="properties" className="space-y-3">
                <KeyValueForm 
                  control={form.control} 
                  name="properties"
                  itemId={currentItemId}
                  entityType="itemMaster"
                />
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