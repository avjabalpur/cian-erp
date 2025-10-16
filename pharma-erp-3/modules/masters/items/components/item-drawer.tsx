'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RightDrawer } from '@/components/shared/right-drawer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemMaster } from '../types';
import { itemMasterSchema, ItemMasterFormValues } from '../validations';
import { ItemBasicInfoForm } from './forms/item-basic-info-form';
import { ItemBoughtOutForm } from './forms/item-bought-out-form';
import { ItemSalesForm } from './forms/item-sales-form';
import { ItemStockAnalysisForm } from './forms/item-stock-analysis-form';
import { ItemExportForm } from './forms/item-export-form';
import { ItemSpecificationsForm } from './forms/item-specifications-form';
import { ItemMediaForm } from './forms/item-media-form';

interface ItemDrawerProps {
  item: ItemMaster | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ItemMasterFormValues) => Promise<void>;
  isLoading: boolean;
  mode: 'create' | 'edit' | 'view';
}

export function ItemDrawer({ item, open, onOpenChange, onSubmit, isLoading, mode }: ItemDrawerProps) {
  const form = useForm<ItemMasterFormValues>({
    resolver: zodResolver(itemMasterSchema),
    defaultValues: {
      itemCode: '',
      itemName: '',
      itemTypeId: 0,
      manufactured: false,
      sold: false,
      boughtOut: false,
      jobWork: false,
      imported: false,
      exported: false,
      keyProduct: false,
      taxCreditApplicable: false,
      qcRequired: false,
      allergen: false,
      batchNotApplicable: false,
      mfgDateApplicable: false,
      expiryDateApplicable: false,
      trackSerialNos: false,
      packingFreightInsuranceServices: false,
      activeIngredient: false,
      mfgLocNameRequired: false,
      mfgMmYyyyApplicable: false,
      expiryMmYyyyApplicable: false,
      principalForStatutoryReporting: false,
    },
  });

  useEffect(() => {
    if (item && open) {
      form.reset({
        itemCode: item.itemCode,
        revNo: item.revNo,
        itemTypeId: item.itemTypeId,
        subType: item.subType,
        gsInd: item.gsInd,
        goodsType: item.goodsType,
        itemName: item.itemName,
        shortName: item.shortName,
        pharmacopoeiaName: item.pharmacopoeiaName,
        unitOfMeasure: item.unitOfMeasure,
        issuingUnit: item.issuingUnit,
        uomIssConvFactor: item.uomIssConvFactor,
        uomUqcConvFactor: item.uomUqcConvFactor,
        drawingRef: item.drawingRef,
        stdAssayStrength: item.stdAssayStrength,
        shelfLifeMonths: item.shelfLifeMonths,
        shelfLifeDays: item.shelfLifeDays,
        stdRate: item.stdRate,
        leadTimeDays: item.leadTimeDays,
        stdLossOnDry: item.stdLossOnDry,
        safetyStock: item.safetyStock,
        boughtOut: item.boughtOut,
        jobWork: item.jobWork,
        imported: item.imported,
        currentBuyer: item.currentBuyer,
        economicOrderQty: item.economicOrderQty,
        desiredPackSize: item.desiredPackSize,
        taxCreditApplicable: item.taxCreditApplicable,
        freightOn: item.freightOn,
        manufactured: item.manufactured,
        allowedAllergenPercent: item.allowedAllergenPercent,
        stdMfgFeesPerUnit: item.stdMfgFeesPerUnit,
        mainProdCentre: item.mainProdCentre,
        sold: item.sold,
        keyProduct: item.keyProduct,
        exported: item.exported,
        productType: item.productType,
        salesDivision: item.salesDivision,
        productGroup: item.productGroup,
        conversionFactor: item.conversionFactor,
        vendorPartNo: item.vendorPartNo,
        batchNotApplicable: item.batchNotApplicable,
        qcRequired: item.qcRequired,
        allergen: item.allergen,
        mfgDateApplicable: item.mfgDateApplicable,
        expiryDateApplicable: item.expiryDateApplicable,
        trackSerialNos: item.trackSerialNos,
        packingFreightInsuranceServices: item.packingFreightInsuranceServices,
        activeIngredient: item.activeIngredient,
        mfgLocNameRequired: item.mfgLocNameRequired,
        mfgMmYyyyApplicable: item.mfgMmYyyyApplicable,
        expiryMmYyyyApplicable: item.expiryMmYyyyApplicable,
        principalForStatutoryReporting: item.principalForStatutoryReporting,
      });
    } else if (!item && open) {
      form.reset();
    }
  }, [item, open, form]);

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Item';
      case 'edit':
        return 'Edit Item';
      case 'view':
        return 'Item Details';
      default:
        return 'Item';
    }
  };

  const handleSubmit = async (data: ItemMasterFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="full"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="bought-out">Bought Out</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="stock">Stock Analysis</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="basic" className="space-y-4">
              <ItemBasicInfoForm control={form.control} itemId={item?.id} />
            </TabsContent>

            <TabsContent value="bought-out" className="space-y-4">
              <ItemBoughtOutForm control={form.control} itemId={item?.id} />
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <ItemSalesForm control={form.control} itemId={item?.id} />
            </TabsContent>

            <TabsContent value="stock" className="space-y-4">
              <ItemStockAnalysisForm control={form.control} itemId={item?.id} />
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <ItemExportForm control={form.control} itemId={item?.id} />
            </TabsContent>

            <TabsContent value="specifications" className="space-y-4">
              <ItemSpecificationsForm control={form.control} itemId={item?.id} />
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <ItemMediaForm control={form.control} itemId={item?.id} />
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              <div className="text-sm text-muted-foreground">Properties section</div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          {mode !== 'view' && (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
        </div>
      </form>
    </RightDrawer>
  );
}

