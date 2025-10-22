"use client";

import { Control, useWatch } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormDateInput } from "@/components/shared/forms/form-date-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormLookup } from "@/components/shared/forms/form-lookup";
import { CustomerLookup } from "@/components/shared/lookups/customer-lookup";
import { ItemLookup } from "@/components/shared/lookups/item-lookup";
import { UserLookup } from "@/components/shared/lookups/user-lookup";
import { SalesOrderUpdateFormValues } from "../validations/sales-order.schema";
import { useOrganizations } from "@/modules/masters/organizations/hooks";
import { useDosages } from "@/modules/masters/dosages/hooks";
import { useUsers } from "@/modules/administrator/users";

interface SOInfoFormProps {
  control: Control<SalesOrderUpdateFormValues>;
  disabled?: boolean;
  onCustomerSelect?: (customer: any) => void;
  onItemSelect?: (item: any) => void;
  onManufacturerSelect?: (manufacturer: any) => void;
}

export function SOInfoForm({ control, disabled, onCustomerSelect, onItemSelect, onManufacturerSelect }: SOInfoFormProps) {
  const [isCustomerLookupOpen, setIsCustomerLookupOpen] = useState(false);
  const [isItemLookupOpen, setIsItemLookupOpen] = useState(false);
  const [isUserLookupOpen, setIsUserLookupOpen] = useState(false);
  const lastProcessedManufacturer = useRef<string>("");

  const watchedValues = useWatch({ control });
  const customerId = watchedValues.customerId;
  const itemId = watchedValues.itemId;
  const organizationId = watchedValues.organizationId;
  const assignedDesigner = watchedValues.assignedDesigner;

  // Get user data for assigned designer
  const { data: usersData } = useUsers({ 
    pageNumber: 1, 
    pageSize: 1,
    id: assignedDesigner 
  });
  const assignedDesignerUser = usersData?.items?.[0];

  // Get organizations for manufacturer dropdown
  const { data: organizationsData } = useOrganizations();
  const organizations = organizationsData?.items || [];

  const manufacturerOptions = [
    { label: 'Select manufacturer', value: '-1' },
    ...organizations.map(org => ({ label: org.name, value: org.id.toString(), country: org.country }))
  ];

  // Get dosages
  const { data: dosagesData } = useDosages();
  const dosages = dosagesData?.items || [];
  
  const dosageOptions = [
    { label: 'Select dosage', value: '-1' },
    ...dosages.map(d => ({ label: d.name, value: d.name }))
  ];

  const salesOrderStatusOptions = [
    { label: 'Select status', value: '-1' },
    { label: 'REPEAT', value: 'repeat' },
    { label: 'NEW', value: 'new' },
    { label: 'REVISED', value: 'revised' },
  ];

  const paymentTermsOptions = [
    { label: 'Select payment term', value: '-1' },
    { label: '30 Days', value: '30' },
    { label: '60 Days', value: '60' },
    { label: '90 Days', value: '90' },
    { label: 'Advance', value: 'advance' },
  ];

  // Watch for manufacturer changes
  useEffect(() => {
    if (organizationId && organizationId !== "-1" && organizationId !== "0") {
      const selectedManufacturer = manufacturerOptions.find(option => option.value === organizationId);
      if (selectedManufacturer && onManufacturerSelect && organizationId !== lastProcessedManufacturer.current) {
        lastProcessedManufacturer.current = organizationId;
        onManufacturerSelect(selectedManufacturer);
      }
    }
  }, [organizationId, manufacturerOptions, onManufacturerSelect]);

  const getCustomerDisplayValue = (value: string) => {
    const customerName = watchedValues.customerName;
    const customerCode = watchedValues.customerCode;
    if (customerId && customerName && customerCode) {
      return `${customerCode} - ${customerName}`;
    }
    return value || "Select customer";
  };

  const getItemDisplayValue = (value: string) => {
    const productName = watchedValues.productName;
    const productCode = watchedValues.productCode;
    if (itemId && productName && productCode) {
      return `${productCode} - ${productName}`;
    }
    return value || "Select item";
  };

  const getUserDisplayValue = (value: string) => {
    if (assignedDesigner && assignedDesignerUser) {
      return `${assignedDesignerUser.firstName} ${assignedDesignerUser.lastName}`;
    }
    return value || "Select designer";
  };

  const handleUserSelect = (userId: number) => {
    onCustomerSelect?.({ id: userId }); // This will be handled by parent
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
          disabled={true}
          required
        />

        <FormDateInput
          control={control}
          name="soDate"
          label="SO Date"
          placeholder="Pick a date"
          disabled={true}
          required
        />

        <FormSelect
          control={control}
          name="soStatus"
          label="SO Status"
          options={salesOrderStatusOptions}
          required
        />
      </div>

      <Separator />

      {/* Manufacturer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          control={control}
          name="organizationId"
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
            disabled={true}
          />

          <FormInput
            control={control}
            name="customerCode"
            label="Customer Code"
            placeholder="Customer code"
            disabled={true}
          />

          <FormInput
            control={control}
            name="customerGstNo"
            label="Customer GST No"
            placeholder="Customer GST number"
            disabled={true}
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
            disabled={true}
          />

          <FormInput
            control={control}
            name="productCode"
            label="Product Code"
            placeholder="Product code"
            disabled={true}
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

          <FormInput
            control={control}
            name="quotationNo"
            label="Quotation No"
            placeholder="Enter quotation number"
            disabled={disabled}
          />

          <FormDateInput
            control={control}
            name="quotationDate"
            label="Quotation Date"
            placeholder="Pick a date"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Lookups */}
      <CustomerLookup
        isOpen={isCustomerLookupOpen}
        onClose={() => setIsCustomerLookupOpen(false)}
        onSelect={(customer) => {
          if (onCustomerSelect) onCustomerSelect(customer);
        }}
      />

      <ItemLookup
        isOpen={isItemLookupOpen}
        onClose={() => setIsItemLookupOpen(false)}
        onSelect={(item) => {
          if (onItemSelect) onItemSelect(item);
        }}
      />
    </div>
  );
}

