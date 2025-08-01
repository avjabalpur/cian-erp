import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormDateInput } from "../shared/forms/form-date-input";

interface DosageInformationFormProps {
  control: any;
}

export function DosageInformationForm({ control }: DosageInformationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dosage Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Enter dosage name"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 255 }}
            required
          />
          <FormDateInput
            control={control}
            name="registerDate"
            label="Register Date"
            placeholder="Enter register date"
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