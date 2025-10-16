'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormCheckbox } from "@/components/shared/forms/form-checkbox"
import { FormTextArea } from "@/components/shared/forms/form-text-area"

interface CustomerTypeInformationFormProps {
  control: any;
}

export function CustomerTypeInformationForm({ control }: CustomerTypeInformationFormProps) {
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
              inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
              required
            />
            <FormInput
              control={control}
              name="name"
              label="Name"
              placeholder="Enter customer type name"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 100 }}
              required
            />
          </div>
          <FormTextArea
            control={control}
            name="description"
            label="Description"
            placeholder="Enter description"
            rows={3}
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
  )
}

