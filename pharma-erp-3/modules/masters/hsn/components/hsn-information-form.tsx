import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormTextArea } from "@/components/shared/forms/form-text-area"
import { useHsnTypes } from "../hooks"

interface HsnInformationFormProps {
  control: any;
}

export function HsnInformationForm({ control }: HsnInformationFormProps) {
  const { data: hsnTypes = [], isLoading: isLoadingTypes } = useHsnTypes();
  
  const hsnTypeOptions = [
    { label: 'Select HSN type', value: '' },
    ...hsnTypes.map(type => ({ label: type, value: type }))
  ];
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
              name="code"
              label="HSN Code"
              placeholder="Enter HSN code (e.g., 3004)"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
              required
            />
            <FormInput
              control={control}
              name="name"
              label="Name"
              placeholder="Enter HSN name"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 255 }}
              required
            />
            <FormSelect
              control={control}
              name="hsnType"
              label="HSN Type"
              placeholder={isLoadingTypes ? "Loading..." : "Select HSN type"}
              options={hsnTypeOptions}
              disabled={isLoadingTypes}
            />
            <FormInput
              control={control}
              name="uqc"
              label="UQC"
              placeholder="Enter UQC"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
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

      {/* Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="igstRate"
              label="IGST Rate (%)"
              placeholder="Enter IGST rate"
              inputProps={{
                type: "number",
                min: "0",
                max: "100",
                step: "0.01"
              }}
            />
            <FormInput
              control={control}
              name="cgstRate"
              label="CGST Rate (%)"
              placeholder="Enter CGST rate"
              inputProps={{
                type: "number",
                min: "0",
                max: "100",
                step: "0.01"
              }}
            />
            <FormInput
              control={control}
              name="sgstRate"
              label="SGST Rate (%)"
              placeholder="Enter SGST rate"
              inputProps={{
                type: "number",
                min: "0",
                max: "100",
                step: "0.01"
              }}
            />
            <FormInput
              control={control}
              name="cessRate"
              label="CESS Rate (%)"
              placeholder="Enter CESS rate"
              inputProps={{
                type: "number",
                min: "0",
                max: "100",
                step: "0.01"
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSwitch
              control={control}
              name="isReverseCharges"
              label="Reverse Charges Applicable"
            />
            <FormSwitch
              control={control}
              name="isActive"
              label="Active"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
