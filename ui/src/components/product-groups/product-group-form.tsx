"use client";

import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormSwitch } from "@/components/shared/forms/form-switch";

interface ProductGroupFormProps {
  control: any;
  divisions?: any[];
}

export function ProductGroupForm({ control, divisions = [] }: ProductGroupFormProps) {
  const unitOptions = [
    { label: "NOS - Numbers", value: "NOS" },
    { label: "KGS - Kilograms", value: "KGS" },
    { label: "LTR - Liters", value: "LTR" },
    { label: "MTR - Meters", value: "MTR" },
    { label: "PCS - Pieces", value: "PCS" },
  ];

  const levelOptions = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
  ];

  const conversionFactorUnitOptions = [
    { label: "NOS/NOS", value: "NOS/NOS" },
    { label: "KGS/KGS", value: "KGS/KGS" },
    { label: "LTR/LTR", value: "LTR/LTR" },
    { label: "MTR/MTR", value: "MTR/MTR" },
    { label: "PCS/PCS", value: "PCS/PCS" },
  ];

  const divisionOptions = [
    { label: "Select Division", value: "-1" },
    ...divisions.map((division: any) => ({
      label: division.name,
      value: division.id.toString(),
    })),
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="code"
          label="Code"
          placeholder="Enter product group code"
          required
        />

        <FormInput
          control={control}
          name="productGroupName"
          label="Product Group Name"
          placeholder="Enter product group name"
          required
        />

        <FormSelect
          control={control}
          name="level"
          label="Level"
          options={levelOptions}
          required
        />

        <FormSelect
          control={control}
          name="unit"
          label="Unit"
          options={unitOptions}
        />

        <FormSelect
          control={control}
          name="salesDivisionCode"
          label="Sales Division"
          options={divisionOptions}
        />

        <FormSelect
          control={control}
          name="uomForMls"
          label="UOM for MLS"
          options={unitOptions}
        />

        <FormInput
          control={control}
          name="conversionFactor"
          label="Conversion Factor"
          placeholder="1.00000000"
          inputProps={{ type: "number", step: "0.00000001" }}
        />

        <FormSelect
          control={control}
          name="conversionFactorUnit"
          label="Conversion Factor Unit"
          options={conversionFactorUnitOptions}
        />

        <FormInput
          control={control}
          name="costCentreCode"
          label="Cost Centre Code"
          placeholder="Enter cost centre code"
        />

        <FormInput
          control={control}
          name="revNo"
          label="Rev No"
          placeholder="00938"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSwitch
          control={control}
          name="isClosed"
          label="Is Closed"
        />

        <FormSwitch
          control={control}
          name="isActive"
          label="Is Active"
        />
      </div>
    </div>
  );
} 