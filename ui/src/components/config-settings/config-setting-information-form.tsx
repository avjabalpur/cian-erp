import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormSelect } from "@/components/shared/forms/form-select"

interface ConfigSettingInformationFormProps {
  control: any;
}

export function ConfigSettingInformationForm({ control }: ConfigSettingInformationFormProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
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
              placeholder="Enter setting key"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 100 }}
              required
            />
            <FormInput
              control={control}
              name="settingName"
              label="Setting Name"
              placeholder="Enter setting name"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 150 }}
              required
            />
            <FormInput
              control={control}
              name="description"
              label="Description"
              placeholder="Enter description"
              inputProps={{ type: "text", autoComplete: "off" }}
            />
            <FormInput
              control={control}
              name="defaultValue"
              label="Default Value"
              placeholder="Enter default value"
              inputProps={{ type: "text", autoComplete: "off" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Value Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Value Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="stringValue"
              label="String Value"
              placeholder="Enter string value"
              inputProps={{ type: "text", autoComplete: "off" }}
            />
            <FormInput
              control={control}
              name="integerValue"
              label="Integer Value"
              placeholder="Enter integer value"
              inputProps={{ type: "number", autoComplete: "off" }}
            />
            <FormInput
              control={control}
              name="decimalValue"
              label="Decimal Value"
              placeholder="Enter decimal value"
              inputProps={{ type: "number", step: "0.0001", autoComplete: "off" }}
            />
            <FormSelect
              control={control}
              name="booleanValue"
              label="Boolean Value"
              placeholder="Select boolean value"
              options={[
                { value: "true", label: 'True' },
                { value: "false", label: 'False' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <FormSwitch
            control={control}
            name="isActive"
            label="Active"
          />
        </CardContent>
      </Card>
    </div>
  );
} 