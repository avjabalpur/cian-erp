'use client';

import { Card, CardContent } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormCheckbox } from "@/components/shared/forms/form-checkbox"
import { FormTextArea } from "@/components/shared/forms/form-text-area"

interface ConfigListInformationFormProps {
  control: any;
}

export function ConfigListInformationForm({ control }: ConfigListInformationFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="listCode"
          label="List Code"
          placeholder="Enter list code"
          inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
          required
        />
        <FormInput
          control={control}
          name="listName"
          label="List Name"
          placeholder="Enter list name"
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
      <FormCheckbox
        control={control}
        name="isActive"
        label="Active"
        description="Indicates if this config list is active"
      />
    </div>
  )
}

