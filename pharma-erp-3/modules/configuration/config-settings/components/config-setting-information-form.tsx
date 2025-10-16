'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormCheckbox } from "@/components/shared/forms/form-checkbox"
import { FormTextArea } from "@/components/shared/forms/form-text-area"

interface ConfigSettingInformationFormProps {
  control: any;
}

export function ConfigSettingInformationForm({ control }: ConfigSettingInformationFormProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="settingKey"
              label="Setting Key"
              placeholder="Enter setting key (e.g., MAX_UPLOAD_SIZE)"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 100 }}
              required
            />
            <FormInput
              control={control}
              name="settingName"
              label="Setting Name"
              placeholder="Enter setting name"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 200 }}
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
          <CardTitle>Setting Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="stringValue"
              label="String Value"
              placeholder="Enter string value"
            />
            <FormInput
              control={control}
              name="integerValue"
              label="Integer Value"
              placeholder="Enter integer value"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="decimalValue"
              label="Decimal Value"
              placeholder="Enter decimal value"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormCheckbox
              control={control}
              name="booleanValue"
              label="Boolean Value"
              description="Toggle for true/false"
            />
          </div>
          <FormInput
            control={control}
            name="defaultValue"
            label="Default Value"
            placeholder="Enter default value"
          />
          <FormCheckbox
            control={control}
            name="isActive"
            label="Active"
            description="Indicates if this setting is active"
          />
        </CardContent>
      </Card>
    </div>
  )
}

