"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { Control } from "react-hook-form";
import { CustomerFormData } from "@/validations/customer";

interface CustomerBusinessTermsFormProps {
  control: Control<CustomerFormData>;
  customerId?: number;
}

export function CustomerBusinessTermsForm({ control, customerId }: CustomerBusinessTermsFormProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Terms</CardTitle>
        <CardDescription>Customer business terms and conditions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="businessTerms.0.paymentTermCode"
            label="Payment Term Code"
            placeholder="e.g., NET30, COD"
          />

          <FormInput
            control={control}
            name="businessTerms.0.creditLimit"
            label="Credit Limit"
            placeholder="Enter credit limit"
            inputProps={{ type: "number" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="businessTerms.0.creditPeriodDays"
            label="Credit Period Days"
            placeholder="Enter credit period days"
            inputProps={{ type: "number" }}
          />

          <FormInput
            control={control}
            name="businessTerms.0.cashDiscountPercentage"
            label="Cash Discount Percentage"
            placeholder="Enter cash discount percentage"
            inputProps={{ type: "number" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
