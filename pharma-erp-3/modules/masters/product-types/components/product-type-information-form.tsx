import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormCheckbox } from "@/components/shared/forms/form-checkbox"
import { FormTextArea } from "@/components/shared/forms/form-text-area"
import { useProductTypes } from "../hooks"

interface ProductTypeInformationFormProps {
  control: any;
  currentProductTypeId?: number;
}

export function ProductTypeInformationForm({ control, currentProductTypeId }: ProductTypeInformationFormProps) {
  const { data: productTypesData } = useProductTypes();
  const productTypes = productTypesData?.items || [];

  // Filter out the current product type from parent options to prevent circular reference
  const parentTypeOptions = [
    { label: 'None (Root Level)', value: '' },
    ...productTypes
      .filter(pt => pt.id !== currentProductTypeId)
      .map(pt => ({ label: pt.name, value: String(pt.id) }))
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Type Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormSelect
            control={control}
            name="parentTypeId"
            label="Parent Product Type"
            options={parentTypeOptions}
            placeholder="Select parent product type"
          />
          <FormInput
            control={control}
            name="code"
            label="Code"
            placeholder="Enter product type code"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
            required
          />
          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Enter product type name"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 255 }}
            required
          />
          <FormTextArea
            control={control}
            name="description"
            label="Description"
            placeholder="Enter product type description"
            rows={3}
          />
          <FormCheckbox
            control={control}
            name="isActive"
            label="Active Status"
            inline={true}
          />
        </div>
      </CardContent>
    </Card>
  )
}
