"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { Control } from "react-hook-form";
import { CustomerFormData } from "@/validations/customer";

interface CustomerBankingDetailsFormProps {
  control: Control<CustomerFormData>;
  customerId?: number;
}

export function CustomerBankingDetailsForm({ control, customerId }: CustomerBankingDetailsFormProps) {

  const accountTypeOptions = [
    { label: "Select account type", value: "-1" },
    { label: "Savings", value: "SAVINGS" },
    { label: "Current", value: "CURRENT" },
    { label: "Fixed Deposit", value: "FIXED" },
  ];

  return (
    <Card className="pt-3">
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="bankingDetails.0.bankName"
            label="Bank Name"
            placeholder="Enter bank name"
          />

          <FormInput
            control={control}
            name="bankingDetails.0.bankAccountNumber"
            label="Account Number"
            placeholder="Enter account number"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="bankingDetails.0.bankIfscCode"
            label="IFSC Code"
            placeholder="Enter IFSC code"
          />

          <FormInput
            control={control}
            name="bankingDetails.0.bankBranch"
            label="Branch Name"
            placeholder="Enter branch name"
          />
        </div>

        <FormSelect
          control={control}
          name="bankingDetails.0.bankAccountTypeCode"
          label="Account Type"
          options={accountTypeOptions}
          placeholder="Select account type"
        />
      </CardContent>
    </Card>
  );
}
