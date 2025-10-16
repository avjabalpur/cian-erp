import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormCheckbox } from "@/components/shared/forms/form-checkbox"
import { FormTextArea } from "@/components/shared/forms/form-text-area"
import { useItemTypes } from "../hooks"

interface ItemTypeInformationFormProps {
  control: any;
  currentItemTypeId?: number;
}

export function ItemTypeInformationForm({ control, currentItemTypeId }: ItemTypeInformationFormProps) {
  const { data: itemTypesData } = useItemTypes();
  const itemTypes = itemTypesData?.items || [];

  // Filter out the current item type from parent options to prevent circular reference
  const parentTypeOptions = [
    { label: 'None (Root Level)', value: '0' },
    ...itemTypes
      .filter(it => it.id !== currentItemTypeId)
      .map(it => ({ label: it.name, value: String(it.id) }))
  ];

  return (
        <div className="grid grid-cols-1 gap-4">
          <FormSelect
            control={control}
            name="parentTypeId"
            label="Parent Item Type"
            options={parentTypeOptions}
            placeholder="Select parent item type"
          />
          <FormInput
            control={control}
            name="code"
            label="Code"
            placeholder="Enter item type code"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
            required
          />
          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Enter item type name"
            inputProps={{ type: "text", autoComplete: "off", maxLength: 255 }}
            required
          />
          <FormTextArea
            control={control}
            name="description"
            label="Description"
            placeholder="Enter item type description"
            rows={3}
          />
          <FormCheckbox
            control={control}
            name="isActive"
            label="Active Status"
            inline={true}
          />
        </div>
    
  )
}
