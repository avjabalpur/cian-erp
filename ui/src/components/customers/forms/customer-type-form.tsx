"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { Control } from "react-hook-form";
import { CustomerTypeFormData } from "@/validations/customer-type";

interface CustomerTypeFormProps {
  control: Control<CustomerTypeFormData>;
}

export function CustomerTypeForm({ control }: CustomerTypeFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the basic details for the customer type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="code"
              label="Code"
              placeholder="Enter customer type code"
              required
            />

            <FormInput
              control={control}
              name="name"
              label="Name"
              placeholder="Enter customer type name"
              required
            />
          </div>

          <FormTextArea
            control={control}
            name="description"
            label="Description"
            placeholder="Enter description"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Type Configuration</CardTitle>
          <CardDescription>Configure the customer type settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormCheckbox
              control={control}
              name="isExportType"
              label="Export Type"
              description="Indicates if this is an export customer type"
            />

            <FormCheckbox
              control={control}
              name="isDomesticType"
              label="Domestic Type"
              description="Indicates if this is a domestic customer type"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormCheckbox
              control={control}
              name="requiresDrugLicense"
              label="Requires Drug License"
              description="Indicates if drug license is required for this type"
            />

            <FormCheckbox
              control={control}
              name="creditTermsApplicable"
              label="Credit Terms Applicable"
              description="Indicates if credit terms are applicable for this type"
            />
          </div>

          <FormCheckbox
            control={control}
            name="isActive"
            label="Active"
            description="Indicates if this customer type is active"
          />
        </CardContent>
      </Card>
    </div>
  );
}
