"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { Control } from "react-hook-form";
import { CustomerFormData } from "@/validations/customer";

interface CustomerTaxComplianceFormProps {
  control: Control<CustomerFormData>;
  customerId?: number;
}

export function CustomerTaxComplianceForm({ control, customerId }: CustomerTaxComplianceFormProps) {

  return (
    <Card className="pt-3">
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="taxCompliance.0.vatFormCode"
            label="VAT Form Code"
            placeholder="Enter VAT form code"
          />

          <FormInput
            control={control}
            name="taxCompliance.0.centralFormCode"
            label="Central Form Code"
            placeholder="Enter central form code"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="taxCompliance.0.tcsType"
            label="TCS Type"
            placeholder="Enter TCS type"
          />

          <FormInput
            control={control}
            name="taxCompliance.0.customerInterfaceCode"
            label="Customer Interface Code"
            placeholder="Enter customer interface code"
            inputProps={{ type: "number" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
