import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormTextarea } from "@/components/shared/forms/form-textarea"
import { FormSelect } from "@/components/shared/forms/form-select"

interface ItemSpecificationsFormProps {
  control: any;
}

export function ItemSpecificationsForm({ control }: ItemSpecificationsFormProps) {
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
            label="Standard Weight (in Kgs.)"
            placeholder="Enter standard weight"
            inputProps={{ type: "number", step: "0.001" }}
          />
        </CardContent>
      </Card>

      {/* Costing Rate Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Costing Rate Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="standardConversionCostFactor"
              label="Standard Conversion Cost Factor"
              placeholder="1.00000"
              inputProps={{ type: "number", step: "0.00001" }}
            />
            <FormInput
              control={control}
              name="standardPackingCostFactor"
              label="Standard Packing Cost Factor"
              placeholder="1.00000"
              inputProps={{ type: "number", step: "0.00001" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="costFactorPercent"
              label="Cost Factor %"
              placeholder="0.00 %"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="packingCostRs"
              label="Packing Cost (RS)"
              placeholder="2.000 RS"
              inputProps={{ type: "number", step: "0.001" }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 