import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"

interface LocationTypeInformationFormProps {
  control: any;
}

export function LocationTypeInformationForm({ control }: LocationTypeInformationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Type Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            control={control}
            name="code"
            label="Code"
            placeholder="Enter location type code"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 10 }}
            required
          />
          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Enter location type name"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 100 }}
            required
          />
          <FormSwitch
            control={control}
            name="isActive"
            label="Active"
          />
        </div>
      </CardContent>
    </Card>
  )
} 