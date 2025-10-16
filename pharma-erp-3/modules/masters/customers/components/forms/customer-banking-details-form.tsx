'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";

interface CustomerBankingDetailsFormProps {
  control: any;
  customerId?: number;
}

export function CustomerBankingDetailsForm({ control, customerId }: CustomerBankingDetailsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Banking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="bankIfscCode"
            label="Bank IFSC Code"
            placeholder="Enter IFSC code"
          />
          <FormInput
            control={control}
            name="bankAccountNumber"
            label="Bank Account Number"
            placeholder="Enter account number"
          />
          <FormInput
            control={control}
            name="bankName"
            label="Bank Name"
            placeholder="Enter bank name"
          />
          <FormInput
            control={control}
            name="bankBranch"
            label="Bank Branch"
            placeholder="Enter branch name"
          />
          <FormInput
            control={control}
            name="bankLocation"
            label="Bank Location"
            placeholder="Enter bank location"
          />
          <FormInput
            control={control}
            name="bankAccountTypeCode"
            label="Account Type"
            placeholder="e.g., Savings, Current"
          />
          <FormInput
            control={control}
            name="customerBanker"
            label="Customer Banker"
            placeholder="Enter banker name"
          />
          <FormInput
            control={control}
            name="customerVpa"
            label="UPI/VPA"
            placeholder="Enter UPI ID"
          />
        </div>
      </CardContent>
    </Card>
  );
}

