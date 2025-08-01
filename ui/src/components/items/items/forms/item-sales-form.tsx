import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormSelect } from "@/components/shared/forms/form-select"

interface ItemSalesFormProps {
  control: any;
  itemId?: number;
}

export function ItemSalesForm({ control, itemId }: ItemSalesFormProps) {
  const productTypeOptions = [
    { label: "Select product type", value: "-1" },
    { label: "Finished Goods", value: "FG" },
    { label: "Raw Material", value: "RM" },
    { label: "Semi-Finished", value: "SF" },
  ];

  return (
    <div className="space-y-4">
      {/* Sales Flags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Sales Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormSwitch
              control={control}
              name="sold"
              label="Sold"
            />
            <FormSwitch
              control={control}
              name="keyProduct"
              label="Key Product"
            />
            <FormSwitch
              control={control}
              name="exported"
              label="Exported"
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSelect
              control={control}
              name="productType"
              label="Product Type"
              options={productTypeOptions}
            />
            <FormInput
              control={control}
              name="salesDivision"
              label="Sales Division"
              placeholder="Enter sales division"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="productGroup"
              label="Product Group"
              placeholder="Enter product group"
            />
            <FormInput
              control={control}
              name="conversionFactor"
              label="Conversion Factor"
              placeholder="0.00000"
              inputProps={{ type: "number", step: "0.00001" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vendor Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Vendor Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="vendorPartNo"
            label="Vendor Part No."
            placeholder="Enter vendor part number"
          />
        </CardContent>
      </Card>
    </div>
  )
} 