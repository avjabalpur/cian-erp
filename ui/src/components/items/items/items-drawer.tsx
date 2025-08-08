"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCreateItemMaster, useUpdateItemMaster, useItemMasterById } from "@/hooks/items/use-item-master";
import { useCreateItemSpecification, useUpdateItemSpecification } from "@/hooks/items/use-item-specifications";
import { useCreateItemSalesDetail, useUpdateItemSalesDetail } from "@/hooks/items/use-item-sales-details";
import { useCreateItemBoughtOutDetails, useUpdateItemBoughtOutDetails } from "@/hooks/items/use-item-bought-out-details";
import { useCreateItemStockAnalysis, useUpdateItemStockAnalysis } from "@/hooks/items/use-item-stock-analysis";
import { useCreateItemExportDetails, useUpdateItemExportDetails } from "@/hooks/items/use-item-export-details";
import { useCreateItemOtherDetail, useUpdateItemOtherDetail } from "@/hooks/items/use-item-other-details";
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
  
  // Fetch complete item data when editing
  const { data: completeItemData, isLoading: isLoadingItem } = useItemMasterById(item?.id || 0);
  
  // Main item mutations
  const createItemMutation = useCreateItemMaster();
  const updateItemMutation = useUpdateItemMaster();
  
  // Related data mutations
  const createSpecificationMutation = useCreateItemSpecification();
  const updateSpecificationMutation = useUpdateItemSpecification();
  
  const createSalesDetailMutation = useCreateItemSalesDetail();
  const updateSalesDetailMutation = useUpdateItemSalesDetail();
  
  const createBoughtOutDetailsMutation = useCreateItemBoughtOutDetails();
  const updateBoughtOutDetailsMutation = useUpdateItemBoughtOutDetails();
  
  const createStockAnalysisMutation = useCreateItemStockAnalysis();
  const updateStockAnalysisMutation = useUpdateItemStockAnalysis();
  
  const createExportDetailsMutation = useCreateItemExportDetails();
  const updateExportDetailsMutation = useUpdateItemExportDetails();
  
  const createOtherDetailsMutation = useCreateItemOtherDetail();
  const updateOtherDetailsMutation = useUpdateItemOtherDetail();

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

  const saveRelatedData = async (itemId: number, formData: ItemMasterFormData) => {
    const promises = [];

    // Save specification
    if (formData.itemSpecification) {
      const specData = { 
        itemId,
        specification: formData.itemSpecification,
        substituteItemFor: formData.substituteItemFor,
        customTariffNo: formData.customTariffNo,
        exciseTariffNo: formData.exciseTariffNo,
        vatCommCode: formData.vatCommCode,
        conversionFactor: formData.convFactor ? formData.convFactor : undefined,
        oldCode: formData.oldCode,
        standardWeight: formData.standardWeight ? formData.standardWeight : undefined,
        standardConversionCostFactor: formData.standardConversionCostFactor ? formData.standardConversionCostFactor : undefined,
        standardPackingCostFactor: formData.standardPackingCostFactor ? formData.standardPackingCostFactor : undefined,
        costFactorPercent: formData.costFactorPercent ? formData.costFactorPercent : undefined,
        packingCostRs: formData.packingCostRs ? formData.packingCostRs : undefined,
      };
      if (completeItemData?.specification) {
        promises.push(updateSpecificationMutation.mutateAsync({ itemId, data: specData }));
      } else {
        promises.push(createSpecificationMutation.mutateAsync({ itemId, data: specData }));
      }
    }

    // Save sales details
    if (formData.packSizeApplicable !== undefined || formData.defaultPackSize || formData.saleableUnitContains || formData.qtyPerBox || formData.boxesPerCase || formData.casePackingType || formData.packingRate || formData.qtyPerCase || formData.netWeightCase || formData.tareWeightCase || formData.grossWeightCase || formData.grossWeightUnit || formData.caseDimensionsInches || formData.caseVolumeCft || formData.caseDimensionsCm || formData.caseVolumeCbm || formData.minSaleRate || formData.minSoQty || formData.tertiaryGtin || formData.secondaryGtin || formData.primaryGtin || formData.minBatchQtyAutoloading || formData.considerAsNewProductTill || formData.interfaceCode || formData.specs) {
      const salesData = {
        itemId,
        packSizeApplicable: formData.packSizeApplicable || false,
        defaultPackSize: formData.defaultPackSize,
        saleableUnitContains: formData.saleableUnitContains ? formData.saleableUnitContains : undefined,
        qtyPerBox: formData.qtyPerBox ? formData.qtyPerBox : undefined,
        boxesPerCase: formData.boxesPerCase ? formData.boxesPerCase : undefined,
        casePackingType: formData.casePackingType,
        packingRate: formData.packingRate ? formData.packingRate : undefined,
        qtyPerCase: formData.qtyPerCase ? formData.qtyPerCase : undefined,
        netWeightCase: formData.netWeightCase ? formData.netWeightCase : undefined,
        tareWeightCase: formData.tareWeightCase ? formData.tareWeightCase : undefined,
        grossWeightCase: formData.grossWeightCase ? formData.grossWeightCase : undefined,
        grossWeightUnit: formData.grossWeightUnit ? formData.grossWeightUnit : undefined,
        caseDimensionsInches: formData.caseDimensionsInches,
        caseVolumeCft: formData.caseVolumeCft ? formData.caseVolumeCft : undefined,
        caseDimensionsCm: formData.caseDimensionsCm,
        caseVolumeCbm: formData.caseVolumeCbm ? formData.caseVolumeCbm : undefined,
        minSaleRate: formData.minSaleRate ? formData.minSaleRate : undefined,
        minSoQty: formData.minSoQty ? formData.minSoQty : undefined,
        tertiaryGtin: formData.tertiaryGtin,
        secondaryGtin: formData.secondaryGtin,
        primaryGtin: formData.primaryGtin,
        minBatchQtyAutoloading: formData.minBatchQtyAutoloading ? formData.minBatchQtyAutoloading : undefined,
        considerAsNewProductTill: formData.considerAsNewProductTill,
        interfaceCode: formData.interfaceCode,
        specs: formData.specs,
      };
      
      if (completeItemData?.salesDetail) {
        promises.push(updateSalesDetailMutation.mutateAsync({ 
          itemId, 
          id: completeItemData.salesDetail.id, 
          data: salesData  as any
        }));
      } else {
        promises.push(createSalesDetailMutation.mutateAsync({ itemId, data: salesData as any }));
      }
    }

    // Save bought out details
    if (formData.purchaseBasedOn || formData.excessPlanningPercent !== undefined || formData.boughtOutReorderLevel !== undefined) {
      const boughtOutData = {
        itemId,
        purchaseBasedOn: formData.purchaseBasedOn,
        excessPlanningPercent: formData.excessPlanningPercent ? formData.excessPlanningPercent : undefined,
        reorderLevel: formData.boughtOutReorderLevel ? formData.boughtOutReorderLevel : undefined,
        minStockLevel: formData.minStockLevel ? formData.minStockLevel : undefined,
        maxStockLevel: formData.maxStockLevel ? formData.maxStockLevel : undefined,
        minBalanceShelfLifeDays: formData.minBalanceShelfLifeDays ? formData.minBalanceShelfLifeDays : undefined,
        customDutyPercent: formData.customDutyPercent ? formData.customDutyPercent : undefined,
        igstPercent: formData.igstPercent ? formData.igstPercent : undefined,
        swsPercent: formData.swsPercent ? formData.swsPercent : undefined,
        maxPurchaseRate: formData.maxPurchaseRate ? formData.maxPurchaseRate : undefined,
        stopProcurement: formData.stopProcurement || false,
      };
      
      if (completeItemData?.boughtOutDetails) {
        promises.push(updateBoughtOutDetailsMutation.mutateAsync({ 
          itemId, 
          id: completeItemData.boughtOutDetails.id, 
          data: boughtOutData as any
        }));
      } else {
        promises.push(createBoughtOutDetailsMutation.mutateAsync({ itemId, data: boughtOutData as any }));
      }
    }

    // Save stock analysis
    if (formData.abcConsumptionValue || formData.xyzStockValue || formData.fsnMovement || formData.vedAnalysis) {
      const stockAnalysisData = {
        itemId,
        abcConsumptionValue: formData.abcConsumptionValue,
        xyzStockValue: formData.xyzStockValue,
        fsnMovement: formData.fsnMovement,
        vedAnalysis: formData.vedAnalysis,
      };
      
      if (completeItemData?.stockAnalysis) {
        promises.push(updateStockAnalysisMutation.mutateAsync({ 
          itemId, 
          id: completeItemData.stockAnalysis.id, 
          data: stockAnalysisData as any
        }));
      } else {
        promises.push(createStockAnalysisMutation.mutateAsync({ itemId, data: stockAnalysisData as any }));
      }
    }

    // Save export details
    if (formData.itemDescriptionForExports || formData.exportProductGroupCode) {
      const exportData = {
        itemId,
        itemDescriptionForExports: formData.itemDescriptionForExports || "",
        exportProductGroupCode: formData.exportProductGroupCode || "",
        exportProductGroupName: formData.exportProductGroupName || "",
        depbRateListSrlNo: formData.depbRateListSrlNo || "",
        depbRate: formData.depbRate ? formData.depbRate : undefined,
        depbValueCap: formData.depbValueCap ? formData.depbValueCap : undefined,
        depbRemarks: formData.depbRemarks || "",
        dutyDrawbackSrlNo: formData.dutyDrawbackSrlNo || "",
        dutyDrawbackRateType: formData.dutyDrawbackRateType || "",
        dutyDrawbackValueCap: formData.dutyDrawbackValueCap ? formData.dutyDrawbackValueCap : undefined,
        dutyDrawbackRemarks: formData.dutyDrawbackRemarks || "",
      };
      
      if (completeItemData?.exportDetails) {
        promises.push(updateExportDetailsMutation.mutateAsync({ 
          itemId, 
          id: completeItemData.exportDetails.id, 
          data: exportData as any
        }));
      } else {
        promises.push(createExportDetailsMutation.mutateAsync({ itemId, data: exportData as any }));
      }
    }

    // Save other details
    if (formData.packShort || formData.productCast || formData.pvcColor) {
      const otherDetailsData = {
        itemId,
        packShort: formData.packShort,
        productCast: formData.productCast,
        pvcColor: formData.pvcColor,
        color: formData.color,
        flavour: formData.flavour,
        fragrance: formData.fragrance,
        form: formData.form,
        packagingStyle: formData.packagingStyle,
        changePart: formData.changePart,
        size: formData.size,
        withLeaflet: formData.withLeaflet || false,
        withApplicator: formData.withApplicator || false,
        withWad: formData.withWad || false,
        withSilica: formData.withSilica || false,
        withCotton: formData.withCotton || false,
        withMeasuringCap: formData.withMeasuringCap || false,
        withSpoon: formData.withSpoon || false,
        packingNp: formData.packingNp,
        packingNpQty: formData.packingNpQty ? formData.packingNpQty : undefined,
        packingStylePtd: formData.packingStylePtd,
        packingStylePtdQty: formData.packingStylePtdQty ? formData.packingStylePtdQty : undefined,
        notePerStrip: formData.notePerStrip,
        packShortPtdSpec: formData.packShortPtdSpec,
        packShortPtdSize: formData.packShortPtdSize,
        packShortPtdQty: formData.packShortPtdQty ? formData.packShortPtdQty : undefined,
        packingStyleNpSize: formData.packingStyleNpSize,
        packingStyleNpQty: formData.packingStyleNpQty ? formData.packingStyleNpQty : undefined,
        noteForCtn: formData.noteForCtn,
        outerSize: formData.outerSize,
        outerQty: formData.outerQty ? formData.outerQty : undefined,
        shrink: formData.shrink,
        shrinkPacking: formData.shrinkPacking,
        shipperSize: formData.shipperSize,
        qtyPerShipper: formData.qtyPerShipper ? formData.qtyPerShipper : undefined,
        shipperNote: formData.shipperNote,
      };
      
      if (completeItemData?.otherDetails) {
        promises.push(updateOtherDetailsMutation.mutateAsync({ 
          itemId, 
          id: completeItemData.otherDetails.id, 
          data: otherDetailsData as any
        }));
      } else {
        promises.push(createOtherDetailsMutation.mutateAsync({ itemId, data: otherDetailsData as any }));
      }
    }

    // Execute all promises
    if (promises.length > 0) {
      await Promise.all(promises);
    }
  };

  const onSubmit = async (data: ItemMasterFormData) => {
    try {
      console.log('Form data before transformation:', data);
      const transformedData = transformFormDataToApi(data);
      console.log('Transformed data:', transformedData);

      let createdItemId: number = 0;

      if (item) {
        const result = await updateItemMutation.mutateAsync({
          id: item.id,
          data: {...transformedData,itemCode: "CH202"}as unknown as UpdateItemMasterData,
        });
        if (result) {
          createdItemId = item.id;
          toast({
            title: "Success",
            description: "Item updated successfully",
          });
        }
      } else {
        const result = await createItemMutation.mutateAsync({...transformedData,itemCode: "A2AP"}as unknown as CreateItemMasterData);
        if (result) {
          createdItemId = result.id;
          setCurrentItemId(result.id); // Set the currentItemId for new items
          toast({
            title: "Success",
            description: "Item created successfully",
          });
        }
      }

      // Save related data
      if (createdItemId > 0) {
        try {
          await saveRelatedData(createdItemId, data);
          toast({
            title: "Success",
            description: "Item and related data saved successfully",
          });
        } catch (relatedDataError: any) {
          console.error('Related data save error:', relatedDataError);
          toast({
            title: "Warning",
            description: "Item saved but some related data could not be saved. Please check the details.",
            variant: "destructive",
          });
        }
      }

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
      title={item ? "Edit Item" : "Create New Item"}
      description={item 
        ? "Update the item information below." 
        : "Fill in the information below to create a new item."
      }
      size="full"
    >
      <div className="mx-auto w-full">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit,onError)} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="bought-out">Bought Out</TabsTrigger>
                <TabsTrigger value="stock">Stock Analysis</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                {/* <TabsTrigger value="other">Other Details</TabsTrigger> */}
                <TabsTrigger value="media">Media</TabsTrigger>
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