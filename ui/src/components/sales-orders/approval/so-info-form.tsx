"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormDateInput } from "@/components/shared/forms/form-date-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormLookup } from "@/components/shared/forms/form-lookup";
import { CustomerLookup } from "@/components/shared/lookups/customer-lookup";
import { ItemLookup } from "@/components/shared/lookups/item-lookup";
import { useCustomers } from "@/hooks/customers/use-customers";
import { CustomerFilter } from "@/types/customer";
import { Control, useWatch } from "react-hook-form";
import { SalesOrderUpdateFormValues } from "@/validations/sales-order";
import { useState } from "react";
import { SalesOrderOptionsMaster } from "@/lib/constants/sales-order-options";
import { Separator } from "@/components/ui/separator";
import { 
  useManufacturerOptions, 
  usePaymentTermsOptions, 
  useSalesOrderStatusOptions,
  useDosageOptions
} from "@/components/shared/options";

interface SOInfoFormProps {
  control: Control<SalesOrderUpdateFormValues>;
  disabled?: boolean;
  onCustomerSelect?: (customer: any) => void;
  onItemSelect?: (item: any) => void;
}

export function SOInfoForm({ control, disabled, onCustomerSelect, onItemSelect }: SOInfoFormProps) {
  const [isCustomerLookupOpen, setIsCustomerLookupOpen] = useState(false);
  const [isItemLookupOpen, setIsItemLookupOpen] = useState(false);

  // Watch form values for conditional rendering
  const watchedValues = useWatch({ control });
  const customerId = watchedValues.customerId;
  const itemId = watchedValues.itemId;
  const dosageName = watchedValues.dosageName;

  // Get manufacturer options
  const manufacturerOptions = useManufacturerOptions({
    includeDefault: true,
    defaultLabel: "Select manufacturer",
    defaultValue: "-1",
    filterActive: true,
  });

  // Get dosage options
  const dosageOptions = useDosageOptions({
    includeDefault: true,
    defaultLabel: "Select dosage",
    defaultValue: "-1",
    filterActive: true,
  });

  // Get payment terms options
  const paymentTermsOptions = usePaymentTermsOptions({
    includeDefault: true,
    defaultLabel: "Select payment term",
    defaultValue: "-1",
  });

  // Get sales order status options
  const salesOrderStatusOptions = useSalesOrderStatusOptions({
    includeDefault: true,
    defaultLabel: "Select status",
    defaultValue: "-1",
  });

  // Get customer details for display
  const customerFilter: CustomerFilter = {
    page: 1,
    pageSize: 1,
    id: customerId,
  };

  const { data: customerResponse } = useCustomers(customerFilter);
  const customer = customerResponse?.items?.[0];

  const handleCustomerSelect = (selectedCustomer: any) => {
    if (onCustomerSelect) {
      onCustomerSelect(selectedCustomer);
    }
  };

  const handleItemSelect = (selectedItem: any) => {
    if (onItemSelect) {
      onItemSelect(selectedItem);
    }
  };

  const getCustomerDisplayValue = (value: string) => {
    const customerId = watchedValues.customerId;
    const customerName = watchedValues.customerName;
    const customerCode = watchedValues.customerCode;

    console.log("Customer display value:", { customerId, customerName, customerCode, value });

    if (customerId && customerName && customerCode) {
      return `${customerCode} - ${customerName}`;
    }
    return value || "Select customer";
  };

  const getItemDisplayValue = (value: string) => {
    const itemId = watchedValues.itemId;
    const productName = watchedValues.productName;
    const productCode = watchedValues.productCode;

    console.log("Item display value:", { itemId, productName, productCode, value });

    if (itemId && productName && productCode) {
      return `${productCode} - ${productName}`;
    }
    return value || "Select item";
  };

  return (
    <div className="space-y-6">
      {/* Basic SO Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          control={control}
          name="soNumber"
          label="SO Number"
          placeholder="Enter SO number"
          disabled={disabled}
          required
        />

        <FormDateInput
          control={control}
          name="soDate"
          label="SO Date"
          placeholder="Pick a date"
          disabled={disabled}
          required
        />

                 <FormSelect
           control={control}
           name="soStatus"
           label="SO Status"
           options={salesOrderStatusOptions}
           disabled={disabled}
           required
         />

      </div>

      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <FormSelect
          control={control}
          name="manufacturerName"
          label="Manufacturer Name"
          options={manufacturerOptions}
          disabled={disabled}
          required
        />
        <FormInput
          control={control}
          name="country"
          label="Country"
          placeholder="Country"
          disabled={disabled}
        />
      </div>

      <Separator />
      {/* Customer Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormLookup
            control={control}
            name="customerId"
            label="Customer"
            placeholder="Select customer"
            onLookupClick={() => setIsCustomerLookupOpen(true)}
            displayValue={getCustomerDisplayValue}
            disabled={disabled}
            required
          />

          <FormInput
            control={control}
            name="customerName"
            label="Customer Name"
            placeholder="Customer name"
            disabled={true} // Read-only, populated from lookup
          />

          <FormInput
            control={control}
            name="customerCode"
            label="Customer Code"
            placeholder="Customer code"
            disabled={true} // Read-only, populated from lookup
          />

          <FormInput
            control={control}
            name="customerGstNo"
            label="Customer GST No"
            placeholder="Customer GST number"
            disabled={true} // Read-only, populated from lookup
          />


                     <FormSelect
             control={control}
             name="paymentTerm"
             label="Payment Term"
             options={paymentTermsOptions}
             disabled={disabled}
           />
        </div>
      </div>

      <Separator />
      {/* Product Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormLookup
            control={control}
            name="itemId"
            label="Product/Item"
            placeholder="Select product/item"
            onLookupClick={() => setIsItemLookupOpen(true)}
            displayValue={getItemDisplayValue}
            disabled={disabled}
            required
          />

          <FormInput
            control={control}
            name="productName"
            label="Product Name"
            placeholder="Product name"
            disabled={true} // Read-only, populated from lookup
          />

          <FormInput
            control={control}
            name="productCode"
            label="Product Code"
            placeholder="Product code"
            disabled={true} // Read-only, populated from lookup
          />

          <FormInput
            control={control}
            name="productCast"
            label="Product Cast"
            placeholder="Product cast"
            disabled={true} // Read-only, populated from lookup
          />

          <FormSelect
            control={control}
            name="dosageName"
            label="Dosage Form"
            options={dosageOptions}
            disabled={disabled}
            required
          />

          <FormInput
            control={control}
            name="hsnCode"
            label="HSN Code"
            placeholder="Enter HSN code"
            disabled={disabled}
          />
        </div>
      </div>
      <Separator />
      {/* Division and Design Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            control={control}
            name="divisionId"
            label="Division"
            placeholder="Division"
            disabled={true} // Read-only, populated from lookup
          />

          <FormInput
            control={control}
            name="designUnder"
            label="Design Under"
            placeholder="Design under"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="packingStyleDescription"
            label="Packing Style Description"
            placeholder="Packing style description"
            disabled={disabled}
          />
        </div>
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
    </div>
  );
} 