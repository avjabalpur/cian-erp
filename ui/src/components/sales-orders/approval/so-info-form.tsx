"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormDateInput } from "@/components/shared/forms/form-date-input";
import { FormLookup } from "@/components/shared/forms/form-lookup";
import { FormSelect } from "@/components/shared/forms/form-select";
import { CustomerLookup } from "@/components/shared/lookups/customer-lookup";
import { useCustomers } from "@/hooks/customers/use-customers";
import { useItems } from "@/hooks/items/use-items";
import { CustomerFilter } from "@/types/customer";
import { ItemFilter } from "@/hooks/items/use-items";
import { Control, useWatch } from "react-hook-form";
import { SalesOrderUpdateFormValues } from "@/validations/sales-order";
import { useState, useEffect } from "react";
import { SalesOrderOptionsMaster } from "@/lib/constants/sales-order-options";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { ItemLookup } from "@/components/shared/lookups/item-lookup";

interface SOInfoFormProps {
  control: Control<SalesOrderUpdateFormValues>;
  disabled?: boolean;
  permissions?: any;
  currentStatus?: string;
}

export function SOInfoForm({ control, disabled, permissions, currentStatus }: SOInfoFormProps) {
  const [isCustomerLookupOpen, setIsCustomerLookupOpen] = useState(false);
  const [isItemLookupOpen, setIsItemLookupOpen] = useState(false);
  
  // Watch form values for conditional logic
  const customerId = useWatch({ control, name: "customerId" });
  const itemId = useWatch({ control, name: "itemId" });
  const dosageName = useWatch({ control, name: "dosageName" });
  const manufacturerName = useWatch({ control, name: "manufacturerName" });

  // Get customer details for display
  const customerFilter: CustomerFilter = {
    page: 1,
    pageSize: 1,
    id: customerId,
  };
  
  const { data: customerResponse } = useCustomers(customerFilter);
  const customer = customerResponse?.items?.[0];

  // Get item details for display
  const itemFilter: ItemFilter = {
    page: 1,
    pageSize: 1,
    id: itemId,
  };
  
  const { data: itemsResponse } = useItems(itemFilter);
  const item = itemsResponse?.[0];

  // Handle customer selection
  const handleCustomerSelect = (selectedCustomer: any) => {
    // Update form values
    control._formValues.customerId = selectedCustomer.id;
    control._formValues.customerName = selectedCustomer.customerName;
    control._formValues.customerCode = selectedCustomer.customerCode;
    control._formValues.country = selectedCustomer.country;
    control._formValues.customerGstNo = selectedCustomer.gstNo;
  };

  // Handle item selection
  const handleItemSelect = (selectedItem: any) => {
    // Update form values
    control._formValues.itemId = selectedItem.id;
    control._formValues.itemName = selectedItem.itemName;
    control._formValues.productCode = selectedItem.itemCode;
    control._formValues.composition = selectedItem.composition;
    control._formValues.dosageName = selectedItem.dosageName;
  };

  // Get customer display value
  const getCustomerDisplayValue = (value: string) => {
    if (!customer) return value;
    return `${customer.customerCode} - ${customer.customerName}`;
  };

  // Get item display value
  const getItemDisplayValue = (value: string) => {
    if (!item) return value;
    return `${item.itemCode} - ${item.itemName}`;
  };

  // Check if field should be readonly based on permissions and status
  const isFieldReadonly = (fieldName: string) => {
    if (disabled) return true;
    
    // Fields that are always readonly (from Progen)
    const readonlyFields = [
      'soNumber', 'soDate', 'soStatus', 'quotationDate', 'quotationNo'
    ];
    
    if (readonlyFields.includes(fieldName)) return true;
    
    // Check if status is ADDED-TO-PROGEN
    if (currentStatus === "ADDED-TO-PROGEN") return true;
    
    // Check permissions
    if (!permissions?.admin) {
      // BD users can only edit certain fields
      if (permissions?.bd) {
        const bdBlockedFields = [
          'division', 'designUnder', 'pShipperSize', 'pQtyPerShipper', 
          'pNoOfShipper', 'pDomino', 'pShipperDrawingRefCode', 
          'ctnOuterDrawingRefNo', 'ctnInnerDrawingRefNo', 'foilDrawingRefNo',
          'leafletDrawingRefNo', 'tubeDrawingRefNo', 'labelDrawingRefNo',
          'pmOuterCtnStock', 'pmInnerCtnStock', 'pmFoilStock', 'pmLeafletStock',
          'pmTubeStock', 'pmLabelStock'
        ];
        if (bdBlockedFields.includes(fieldName)) return true;
      }
    }
    
    return false;
  };

  // Check if field should be visible based on dosage
  const isFieldVisible = (fieldName: string) => {
    if (!dosageName) return true;
    
    const dosageVisibilityMap: Record<string, Record<string, boolean>> = {
      pColour: {
        TABLET: true, CAPSULE: true, LIQUID: true, OINTMENT: true, 
        POWDER: true, SOFTGEL: true
      },
      pShelfLife: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pPackShort: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      packingStyleDescription: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pTabletType: { TABLET: true, SOFTGEL: true },
      pTabletSize: { TABLET: true, SOFTGEL: true },
      pCapsuleSize: { CAPSULE: true, SOFTGEL: true },
      pChangePart: { TABLET: true, CAPSULE: true, SOFTGEL: true },
      pShipperSize: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pQtyPerShipper: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pNoOfShipper: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pFlavour: { TABLET: true, LIQUID: true, POWDER: true },
      pFragrance: { TABLET: true, LIQUID: true, POWDER: true },
      pQuantity: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pFocQty: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pMrp: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pBillingRate: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pCosting: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pInventoryCharges: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pCylinderCharge: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pDomino: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pShipperDrawingRefCode: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      ctnOuterDrawingRefNo: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      ctnInnerDrawingRefNo: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      foilDrawingRefNo: { TABLET: true, CAPSULE: true, SOFTGEL: true },
      leafletDrawingRefNo: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      tubeDrawingRefNo: { GEL: true, OINTMENT: true, CREAM: true },
      labelDrawingRefNo: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pmOuterCtnStock: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pmInnerCtnStock: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pmFoilStock: { TABLET: true, CAPSULE: true, SOFTGEL: true },
      pmLeafletStock: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pmTubeStock: { GEL: true, OINTMENT: true, CREAM: true },
      pmLabelStock: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      drugApprovalUnder: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      }
    };
    
    const fieldVisibility = dosageVisibilityMap[fieldName];
    return fieldVisibility ? fieldVisibility[dosageName] || false : true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Order Information</CardTitle>
        <CardDescription>
          Basic information about the sales order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SO Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            control={control}
            name="soNumber"
            label="SO Number"
            placeholder="Enter SO number"
            disabled={isFieldReadonly('soNumber')}
          />
          
          <FormDateInput
            control={control}
            name="soDate"
            label="SO Date"
            placeholder="Pick a date"
            disabled={isFieldReadonly('soDate')}
            required
          />
          
          <FormSelect
            control={control}
            name="soStatus"
            label="SO Status"
            options={SalesOrderOptionsMaster.soStatus}
            disabled={isFieldReadonly('soStatus')}
          />
        </div>

        {/* Manufacturer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            control={control}
            name="manufacturerName"
            label="Manufacturer Name"
            options={SalesOrderOptionsMaster.manufacturerName}
            disabled={isFieldReadonly('manufacturerName')}
          />
          
          <FormInput
            control={control}
            name="country"
            label="Country"
            placeholder="Country"
            disabled={isFieldReadonly('country')}
          />
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormLookup
            control={control}
            name="customerId"
            label="Customer"
            placeholder="Select customer"
            onLookupClick={() => setIsCustomerLookupOpen(true)}
            displayValue={getCustomerDisplayValue}
            disabled={isFieldReadonly('customerId')}
            required
          />
          
          <FormInput
            control={control}
            name="customerGstNo"
            label="Customer GST No"
            placeholder="Customer GST number"
            disabled={isFieldReadonly('customerGstNo')}
          />
        </div>

        {/* Payment and HSN Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            control={control}
            name="paymentTerm"
            label="Payment Term"
            options={SalesOrderOptionsMaster.paymentTerms}
            disabled={isFieldReadonly('paymentTerm')}
          />
          
          <FormInput
            control={control}
            name="hsnCode"
            label="HSN Code"
            placeholder="Enter HSN code"
            disabled={isFieldReadonly('hsnCode')}
          />
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormLookup
            control={control}
            name="itemId"
            label="Product/Item"
            placeholder="Select product"
            onLookupClick={() => setIsItemLookupOpen(true)}
            displayValue={getItemDisplayValue}
            disabled={isFieldReadonly('itemId')}
            required
          />
          
          <FormInput
            control={control}
            name="productCode"
            label="Product Code"
            placeholder="Product code"
            disabled={isFieldReadonly('productCode')}
          />
          
          <FormInput
            control={control}
            name="productCast"
            label="Product Cast"
            placeholder="Product cast"
            disabled={isFieldReadonly('productCast')}
          />
        </div>

        {/* Dosage and Division Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            control={control}
            name="dosageName"
            label="Dosage Name"
            options={SalesOrderOptionsMaster.dosageName}
            disabled={isFieldReadonly('dosageName')}
            required
          />
          
          <FormInput
            control={control}
            name="divisionId"
            label="Division"
            placeholder="Enter division"
            disabled={isFieldReadonly('divisionId')}
          />
          
          <FormInput
            control={control}
            name="designUnder"
            label="Design Under"
            placeholder="Enter design under"
            disabled={isFieldReadonly('designUnder')}
          />
        </div>

        {/* Composition */}
        <div className="grid grid-cols-1 gap-4">
          <FormTextArea
            control={control}
            name="composition"
            label="Composition"
            placeholder="Enter composition details"
            disabled={isFieldReadonly('composition')}
            rows={3}
          />
        </div>

        {/* Lookup Modals */}
        <CustomerLookup
          isOpen={isCustomerLookupOpen}
          onClose={() => setIsCustomerLookupOpen(false)}
          onSelect={handleCustomerSelect}
        />
        
        <ItemLookup
          isOpen={isItemLookupOpen}
          onClose={() => setIsItemLookupOpen(false)}
          onSelect={handleItemSelect}
        />
      </CardContent>
    </Card>
  );
} 