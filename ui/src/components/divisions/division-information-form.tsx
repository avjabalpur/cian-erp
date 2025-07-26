import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormSelect } from "@/components/shared/forms/form-select"

interface DivisionInformationFormProps {
  control: any;
  departments: { id: number; name: string }[];
}

export function DivisionInformationForm({ control, departments }: DivisionInformationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Division Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            control={control}
            name="code"
            label="Code"
            placeholder="Enter division code"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 10 }}
            required
          />
          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Enter division name"
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
          <FormSelect
            control={control}
            name="departmentId"
            label="Department"
            options={departments.map(d => ({ label: d.name, value: String(d.id) }))}
            placeholder="Select department"
          />
          <FormInput
            control={control}
            name="unit"
            label="Unit"
            placeholder="Enter unit"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 10 }}
          />
          <FormInput
            control={control}
            name="conversionFactor"
            label="Conversion Factor"
            placeholder="Enter conversion factor"
            inputProps={{ type: "number", step: "0.01", min: "0" }}
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