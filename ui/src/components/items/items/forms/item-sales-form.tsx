import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormSwitch } from "@/components/shared/forms/form-switch"

interface ItemSalesFormProps {
  control: any;
}

export function ItemSalesForm({ control }: ItemSalesFormProps) {
  const productTypeOptions = [
    { label: "Select product type", value: "" },
    { label: "Sale Pack", value: "Sale Pack" },
    { label: "Bulk", value: "Bulk" },
    { label: "Sample", value: "Sample" },
  ];

  return (
    <div className="space-y-4">
      {/* Sales Properties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Sales Properties</CardTitle>
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
              name="thirdParty"
              label="THIRD PARTY"
              placeholder="Enter third party"
            />
            <FormInput
              control={control}
              name="productGroup"
              label="Product Group"
              placeholder="Enter product group"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pack Size & Rate Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Pack Size & Rate Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="packSizeApplicable"
              label="Pack Size Applicable"
            />
            <FormInput
              control={control}
              name="defaultPackSize"
              label="Default Pack Size"
              placeholder="Enter default pack size"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="saleableUnitContains"
              label="Each Saleable Unit contains"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="minSaleRate"
              label="Min. Sale Rate"
              placeholder="0.00000"
              inputProps={{ type: "number", step: "0.00001" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="minSoQty"
              label="Min. S.O. Qty."
              placeholder="0.000"
              inputProps={{ type: "number", step: "0.001" }}
            />
            <FormInput
              control={control}
              name="minBatchQtyAutoloading"
              label="Min. Batch Qty. for Autoloading"
              placeholder="0.000"
              inputProps={{ type: "number", step: "0.001" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Packing Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Packing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="qtyPerBox"
              label="Qty./Box"
              placeholder="0 NOS"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="boxesPerCase"
              label="Boxes/Case"
              placeholder="0 NOS"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="casePackingType"
              label="Case Packing Type"
              placeholder="Enter packing type"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="packingRate"
              label="Packing Rate"
              placeholder="0.000 RS"
              inputProps={{ type: "number", step: "0.001" }}
            />
            <FormInput
              control={control}
              name="qtyPerCase"
              label="Qty./Case"
              placeholder="100.00 NOS"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="netWtPerCase"
              label="Net Wt./Case"
              placeholder="0.000 KGS"
              inputProps={{ type: "number", step: "0.001" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="tareWtPerCase"
              label="Tare Wt./Case"
              placeholder="0.000 KGS"
              inputProps={{ type: "number", step: "0.001" }}
            />
            <FormInput
              control={control}
              name="grossWtPerCase"
              label="Gross Wt./Case"
              placeholder="0.000 KGS"
              inputProps={{ type: "number", step: "0.001" }}
            />
            <FormInput
              control={control}
              name="grossWtPerUnit"
              label="Gross Wt./Unit"
              placeholder="0.00000 KGS"
              inputProps={{ type: "number", step: "0.00001" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="caseDimensionsInches"
              label="Case Dimensions (in Inches)"
              placeholder="Enter dimensions"
            />
            <FormInput
              control={control}
              name="caseVolumeCft"
              label="Case Volume (in CFT)"
              placeholder="0.0000"
              inputProps={{ type: "number", step: "0.0001" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="caseDimensionsCm"
              label="Case Dimensions (In CM)"
              placeholder="Enter dimensions"
            />
            <FormInput
              control={control}
              name="caseVolumeCbm"
              label="Case Volume (in CBM)"
              placeholder="0.0000"
              inputProps={{ type: "number", step: "0.0001" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* GTIN Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">GTIN No. Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="primaryGtin"
              label="Primary GTIN"
              placeholder="Enter primary GTIN"
            />
            <FormInput
              control={control}
              name="secondaryGtin"
              label="Secondary GTIN"
              placeholder="Enter secondary GTIN"
            />
            <FormInput
              control={control}
              name="tertiaryGtin"
              label="Tertiary GTIN"
              placeholder="Enter tertiary GTIN"
            />
          </div>
        </CardContent>
      </Card>

      {/* Other Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Other Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="considerAsNewProductTill"
              label="Consider as New Product till"
              placeholder="//"
            />
            <FormInput
              control={control}
              name="interfaceCode"
              label="Interface Code"
              placeholder="Enter interface code"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="cc03"
              label="CC03"
              placeholder="Enter CC03"
            />
            <FormInput
              control={control}
              name="conversionFactor"
              label="Conversion Factor"
              placeholder="NOS/NOS"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="wrtProductGroup"
              label="(w.r.t. Product Group)"
              placeholder="Enter product group reference"
            />
            <FormInput
              control={control}
              name="vendorsPartNo"
              label="Vendor's Part No."
              placeholder="Enter vendor part number"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 