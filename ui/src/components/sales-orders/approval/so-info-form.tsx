"use client";

import { Control } from "react-hook-form";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { FormSelect } from "@/components/shared/forms/form-select";
import { SalesOrderUpdateFormValues } from "@/validations/sales-order";
import { soStatusOptions, paymentTermOptions } from "@/lib/utils/sales-order-utils";

interface SOInfoFormProps {
  control: Control<SalesOrderUpdateFormValues>;
  disabled?: boolean;
}

export function SOInfoForm({ control, disabled }: SOInfoFormProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
        <FormInput
          control={control}
          name="soNumber"
          label="SONO"
          placeholder="Enter SO Number"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="manufacturerName"
          label="Manufacturer Name"
          options={[
            { label: "CIAN HEALTHCARE", value: "CIAN HEALTHCARE" },
            { label: "Other Manufacturer", value: "OTHER" }
          ]}
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="customerId"
          label="Customer Name"
          options={[
            { label: "Select Customer", value: "-1" },
            { label: "Customer 1", value: "1" },
            { label: "Customer 2", value: "2" }
          ]}
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="paymentTerm"
          label="Payment Term"
          options={[
            { label: "Select Payment Term", value: "-1" },
            { label: "Net 30", value: "NET30" },
            { label: "Net 60", value: "NET60" }
          ]}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="itemName"
          label="Product Name"
          placeholder="Enter product name"
          disabled={disabled}
        />
    
        <FormInput
          control={control}
          name="soDate"
          label="SO Date"
          type="date"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="country"
          label="Country"
          options={[
            { label: "Select Country", value: "-1" },
            { label: "India", value: "INDIA" },
            { label: "USA", value: "USA" }
          ]}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="customerGstNo"
          label="Customer GST No"
          placeholder="Enter GST number"
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
          name="itemId"
          label="Product Code"
          placeholder="Enter product code"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="productCast"
          label="Product Cast"
          options={[
            { label: "Select Product Cast", value: "-1" },
            { label: "Cast 1", value: "CAST1" },
            { label: "Cast 2", value: "CAST2" }
          ]}
          disabled={disabled}
        />
    </div>
  );
} 