import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"

interface DepartmentInformationFormProps {
  control: any;
}

export function DepartmentInformationForm({ control }: DepartmentInformationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            control={control}
            name="code"
            label="Code"
            placeholder="Enter department code"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 10 }}
            required
          />
          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Enter department name"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 100 }}
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
            name="uomForMis"
            label="UOM for MIS"
            placeholder="Enter UOM for MIS"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 10 }}
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