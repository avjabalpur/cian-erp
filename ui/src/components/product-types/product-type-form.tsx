"use client";

import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormSwitch } from "@/components/shared/forms/form-switch";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { useProductTypeOptions } from "@/components/shared/options";

interface ProductTypeFormProps {
  control: any;
  excludeId?: number;
}

export function ProductTypeForm({ control, excludeId }: ProductTypeFormProps) {
  const productTypeOptions = useProductTypeOptions({ excludeId });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="code"
          label="Code"
          placeholder="Enter product type code"
          required
        />

        <FormInput
          control={control}
          name="name"
          label="Name"
          placeholder="Enter product type name"
          required
        />

        <FormSelect
          control={control}
          name="parentTypeId"
          label="Parent Type"
          options={productTypeOptions}
          placeholder="Select parent type (optional)"
        />

        <FormSwitch
          control={control}
          name="isActive"
          label="Is Active"
        />
      </div>

      <FormTextArea
        control={control}
        name="description"
        label="Description"
        placeholder="Enter product type description"
        rows={3}
      />
    </div>
  );
} 