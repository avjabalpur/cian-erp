"use client";

import { Control } from "react-hook-form";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { FormSwitch } from "@/components/shared/forms/form-switch";
import { CustomerFormValues } from "@/validations/customer";
import { 
  customerTypeOptions, 
  segmentOptions, 
  exportTypeOptions, 
  continentOptions, 
  customerSaleTypeOptions 
} from "@/lib/utils/customer-utils";

interface CustomerFormProps {
  control: Control<CustomerFormValues>;
  disabled?: boolean;
}

export function CustomerForm({ control, disabled }: CustomerFormProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput
          control={control}
          name="locationCode"
          label="Location Code"
          placeholder="Enter location code"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="customerNumber"
          label="Customer Number"
          placeholder="Enter customer number"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="customerCode"
          label="Customer Code"
          placeholder="Enter customer code"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="customerName"
          label="Customer Name"
          placeholder="Enter customer name"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="shortName"
          label="Short Name"
          placeholder="Enter short name"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="payeeName"
          label="Payee Name"
          placeholder="Enter payee name"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="customerTypeCode"
          label="Customer Type"
          options={customerTypeOptions}
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="segmentCode"
          label="Segment"
          options={segmentOptions}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="incomeTaxPanNumber"
          label="Income Tax PAN Number"
          placeholder="Enter PAN number"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="customerSaleType"
          label="Customer Sale Type"
          options={customerSaleTypeOptions}
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="exportType"
          label="Export Type"
          options={exportTypeOptions}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="gstin"
          label="GSTIN"
          placeholder="Enter GSTIN"
          disabled={disabled}
        />
      </div>

      {/* License Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput
          control={control}
          name="drugLicenseNumber"
          label="Drug License Number"
          placeholder="Enter drug license number"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="drugLicenseExpiryDate"
          label="Drug License Expiry Date"
          placeholder="Enter expiry date"
          type="date"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="otherLicenseNumber"
          label="Other License Number"
          placeholder="Enter other license number"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="oldCode"
          label="Old Code"
          placeholder="Enter old code"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="customerLotNumber"
          label="Customer Lot Number"
          placeholder="Enter lot number"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="continent"
          label="Continent"
          options={continentOptions}
          disabled={disabled}
        />
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormSwitch
          control={control}
          name="stopInvoice"
          label="Stop Invoice"
          disabled={disabled}
        />
        
        <FormSwitch
          control={control}
          name="isExportCustomer"
          label="Export Customer"
          disabled={disabled}
        />
        
        <FormSwitch
          control={control}
          name="isRegisteredDealer"
          label="Registered Dealer"
          disabled={disabled}
        />
        
        <FormSwitch
          control={control}
          name="isRecordClosed"
          label="Record Closed"
          disabled={disabled}
        />
        
        <FormSwitch
          control={control}
          name="isActive"
          label="Active"
          disabled={disabled}
        />
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <FormTextArea
          control={control}
          name="rebates"
          label="Rebates"
          placeholder="Enter rebates information"
          disabled={disabled}
        />
        
        <FormTextArea
          control={control}
          name="externalInformation"
          label="External Information"
          placeholder="Enter external information"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
