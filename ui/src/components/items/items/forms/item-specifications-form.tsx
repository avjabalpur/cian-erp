import { useEffect } from "react";
import { useController } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormTextarea } from "@/components/shared/forms/form-textarea"
import { FormSelect } from "@/components/shared/forms/form-select"
import { useItemSpecification } from "@/hooks/items/use-item-specifications"

interface ItemSpecificationsFormProps {
  control: any;
  itemId?: number;
}

export function ItemSpecificationsForm({ control, itemId }: ItemSpecificationsFormProps) {
  // Fetch item specification data
  const { data: specificationData, isLoading } = useItemSpecification(itemId || 0);
  
  // Use controller to programmatically set form values
  const { field: specificationField } = useController({
    name: "itemSpecification",
    control,
  });

  const { field: substituteItemField } = useController({
    name: "substituteItemFor",
    control,
  });

  const { field: customTariffField } = useController({
    name: "customTariffNo",
    control,
  });

  const { field: exciseTariffField } = useController({
    name: "exciseTariffNo",
    control,
  });

  const { field: vatCommField } = useController({
    name: "vatCommCode",
    control,
  });

  const { field: convFactorField } = useController({
    name: "convFactor",
    control,
  });

  const { field: oldCodeField } = useController({
    name: "oldCode",
    control,
  });

  const { field: standardWeightField } = useController({
    name: "standardWeight",
    control,
  });

  const { field: standardConversionCostFactorField } = useController({
    name: "standardConversionCostFactor",
    control,
  });

  const { field: standardPackingCostFactorField } = useController({
    name: "standardPackingCostFactor",
    control,
  });

  const { field: costFactorPercentField } = useController({
    name: "costFactorPercent",
    control,
  });

  const { field: packingCostRsField } = useController({
    name: "packingCostRs",
    control,
  });

  // Populate form when specification data is loaded
  useEffect(() => {
    if (specificationData && itemId) {
      specificationField.onChange(specificationData.specification || "");
      substituteItemField.onChange(specificationData.substituteItemFor || "");
      customTariffField.onChange(specificationData.customTariffNo || "");
      exciseTariffField.onChange(specificationData.exciseTariffNo || "");
      vatCommField.onChange(specificationData.vatCommCode || "");
      convFactorField.onChange(specificationData.convFactor?.toString() || "");
      oldCodeField.onChange(specificationData.oldCode || "");
      standardWeightField.onChange(specificationData.standardWeight?.toString() || "");
      standardConversionCostFactorField.onChange(specificationData.standardConversionCostFactor?.toString() || "");
      standardPackingCostFactorField.onChange(specificationData.standardPackingCostFactor?.toString() || "");
      costFactorPercentField.onChange(specificationData.costFactorPercent?.toString() || "");
      packingCostRsField.onChange(specificationData.packingCostRs?.toString() || "");
    }
  }, [specificationData, itemId, specificationField, substituteItemField, customTariffField, exciseTariffField, vatCommField, convFactorField, oldCodeField, standardWeightField, standardConversionCostFactorField, standardPackingCostFactorField, costFactorPercentField, packingCostRsField]);

  if (isLoading && itemId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-500">Loading specifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Item's Specification */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Item's Specification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormTextarea
            control={control}
            name="itemSpecification"
            label="Specification"
            placeholder="Enter detailed item specification..."
          />
        </CardContent>
      </Card>

      {/* Substitute Item */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Substitute Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="substituteItemFor"
            label="Main Item"
            placeholder="Enter substitute item"
          />
        </CardContent>
      </Card>

      {/* Tariff/Commodity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tariff/Commodity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="customTariffNo"
              label="Custom Tariff No."
              placeholder="Enter custom tariff number"
            />
            <FormInput
              control={control}
              name="exciseTariffNo"
              label="Excise Tariff No."
              placeholder="Enter excise tariff number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="vatCommCode"
              label="VAT Comm. Code"
              placeholder="Enter VAT commodity code"
            />
            <FormInput
              control={control}
              name="convFactor"
              label="Conv. Factor"
              placeholder="0.00000"
              inputProps={{ type: "number", step: "0.00001" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* For Reference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">For Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="oldCode"
            label="Old Code"
            placeholder="Enter old code"
          />
        </CardContent>
      </Card>

      {/* Standard Weight */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Standard Weight</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="standardWeight"
            label="Standard Weight"
            placeholder="0.00000"
            inputProps={{ type: "number", step: "0.00001" }}
          />
        </CardContent>
      </Card>

      {/* Standard Conversion Cost Factor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Standard Conversion Cost Factor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="standardConversionCostFactor"
            label="Standard Conversion Cost Factor"
            placeholder="0.00000"
            inputProps={{ type: "number", step: "0.00001" }}
          />
        </CardContent>
      </Card>

      {/* Standard Packing Cost Factor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Standard Packing Cost Factor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="standardPackingCostFactor"
            label="Standard Packing Cost Factor"
            placeholder="0.00000"
            inputProps={{ type: "number", step: "0.00001" }}
          />
        </CardContent>
      </Card>

      {/* Cost Factor Percent */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Cost Factor Percent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="costFactorPercent"
            label="Cost Factor Percent"
            placeholder="0.00"
            inputProps={{ type: "number", step: "0.01" }}
          />
        </CardContent>
      </Card>

      {/* Packing Cost Rs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Packing Cost Rs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="packingCostRs"
            label="Packing Cost Rs"
            placeholder="0.00"
            inputProps={{ type: "number", step: "0.01" }}
          />
        </CardContent>
      </Card>
    </div>
  )
} 