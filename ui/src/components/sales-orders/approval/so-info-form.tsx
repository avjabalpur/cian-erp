"use client";

import { Control } from "react-hook-form";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { FormSelect } from "@/components/shared/forms/form-select";
import { SalesOrderUpdateFormValues } from "@/validations/sales-order";
import { soStatusOptions, paymentTermOptions } from "@/lib/utils/sales-order-utils";
import { useCustomerOptions } from "@/hooks/customers/use-customer-options";
import { SelectOption } from "@/components/shared/forms/types";

interface SOInfoFormProps {
  control: Control<SalesOrderUpdateFormValues>;
  disabled?: boolean;
}

export function SOInfoForm({ control, disabled }: SOInfoFormProps) {
  const { data: customerOptions, isLoading: customersLoading } = useCustomerOptions();

  // Transform customer options for FormSelect
  const customerSelectOptions: SelectOption[] = [
    { label: "Select Customer", value: "-1" },
    ...(customerOptions as any[] || []).map(customer => ({
      label: customer.label,
      value: customer.value
    }))
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
        <FormInput
          control={control}
          name="soNumber"
          label="SONO"
          placeholder="Enter SO Number"
          disabled={disabled}
          inputProps={{
            readOnly: true
          }}
        />
        
        <FormSelect
          control={control}
          name="customerId"
          label="Customer Name"
          options={customerSelectOptions}
          disabled={disabled || customersLoading}
        />
        
        <FormSelect
          control={control}
          name="paymentTerm"
          label="Payment Term"
          options={paymentTermOptions}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="itemId"
          label="Product ID"
          placeholder="Enter product ID"
          disabled={disabled}
        />
    
        <FormInput
          control={control}
          name="soDate"
          label="SO Date"
          placeholder="Enter SO date"
          disabled={disabled}
          inputProps={{
            readOnly: true
          }}
        />
        
        <FormInput
          control={control}
          name="quotationDate"
          label="Quotation Date"
          placeholder="Enter quotation date"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="quotationNo"
          label="Quotation No"
          placeholder="Enter quotation number"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="hsnCode"
          label="HSN Code"
          options={[
            { label: "Select HSN Code", value: "-1" },
            { label: "3004", value: "3004" },
            { label: "3005", value: "3005" }
          ]}
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="soStatus"
          label="SO Status"
          options={[
            { label: "REPEAT", value: "REPEAT" },
            { label: "NEW", value: "NEW" },
            { label: "DRAFT", value: "DRAFT" }
          ]}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="productCode"
          label="Product Code"
          placeholder="Enter product code"
          disabled={disabled}
          inputProps={{
            readOnly: true
          }}
        />
        
        <FormInput
          control={control}
          name="dosageName"
          label="Dosage Name"
          placeholder="Enter dosage name"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="divisionId"
          label="Division ID"
          placeholder="Enter division ID"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="designUnder"
          label="Design Under"
          options={[
            { label: "Select Design Under", value: "-1" },
            { label: "Design Team", value: "DESIGN_TEAM" },
            { label: "Artwork Team", value: "ARTWORK_TEAM" }
          ]}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="country"
          label="Country"
          placeholder="Enter country"
          disabled={disabled}
          inputProps={{
            readOnly: true
          }}
        />
        
        <FormInput
          control={control}
          name="customerGstNo"
          label="Customer GST No"
          placeholder="Enter customer GST number"
          disabled={disabled}
          inputProps={{
            readOnly: true
          }}
        />
    </div>
  );
} 