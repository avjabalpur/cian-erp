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
    <div className="space-y-2">
      {/* Pack Size/Rate Details */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex items-center space-x-4">
              <FormSwitch
                control={control}
                name="packSizeApplicable"
                label="Pack Size Applicable"
              />
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="defaultPackSize"
                label="Default Pack Size"
                placeholder="Enter default pack size"
                inputProps={{ type: "number", step: "0.01" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <FormInput
            control={control}
            name="saleableUnitQty"
            label=" Saleable Unit contains"
            placeholder="0"
            inputProps={{ type: "number", step: "0.01" }}
          />
        </CardContent>
      </Card>

      {/* Packing Details */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="qtyPerBox"
                placeholder="0"
                label="Qty./Box"
                inputProps={{ type: "number", step: "0.01" }}
              />
              <span className="text-sm text-gray-500">NOS</span>
            </div>
            <div className="flex items-center space-x-3">

              <div className="flex-1 flex items-center space-x-2">
                <FormInput
                  control={control}
                  name="boxesPerCase"
                  placeholder="0"
                  inputProps={{ type: "number", step: "0.01" }}
                  label="Boxes/Case"
                />
                <span className="text-sm text-gray-500">NOS</span>
              </div>
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="casePackingType"
                placeholder=""
                label="Case Packing Type"
              />
              <button
                type="button"
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-600"
              >
                -
              </button>
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="packingRate"
                placeholder="0.000"
                inputProps={{ type: "number", step: "0.001" }}
                label="Packing Rate"
              />
              <span className="text-sm text-gray-500">RS</span>
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="qtyPerCase"
                placeholder="100.00"
                label="Packing Rate"
                inputProps={{ type: "number", step: "0.01" }}
              />
              <span className="text-sm text-gray-500">NOS</span>
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="netWeightPerCase"
                placeholder="0.000"
                label="Net Wt./Case"
                inputProps={{ type: "number", step: "0.001" }}
              />
              <span className="text-sm text-gray-500">KGS</span>
            </div>

            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="tareWeightPerCase"
                placeholder="0.000"
                inputProps={{ type: "number", step: "0.001" }}
                label="Tare Wt./Case"
              />
              <span className="text-sm text-gray-500">KGS</span>
            </div>

            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="grossWeightPerCase"
                placeholder="0.000"
                inputProps={{ type: "number", step: "0.001" }}
                label="Gross Wt./Case"
              />
              <span className="text-sm text-gray-500">KGS</span>
            </div>

            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="grossWeightPerUnit"
                placeholder="0.00000"
                inputProps={{ type: "number", step: "0.00001" }}
                label="Gross Wt./Unit"
              />
              <span className="text-sm text-gray-500">KGS</span>
            </div>

            <div className="flex-1">
              <FormInput
                control={control}
                name="caseDimensionsInches"
                placeholder="PROMOTIONAL"
                label="Case Dimensions (in Inches)"
              />
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="caseVolumeCft"
                placeholder="0.0000"
                inputProps={{ type: "number", step: "0.0001" }}
                label="Case Volume (in CFT)"
              />
            </div>
            <div className="flex-1">
              <FormInput
                control={control}
                name="caseDimensionsCm"
                placeholder=""
                label="Case Dimensions (In CM)"
              />
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="caseVolumeCbm"
                placeholder="0.0000"
                inputProps={{ type: "number", step: "0.0001" }}
                label="Case Volume (in CBM)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GTIN No. Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">GTIN No. Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="tertiaryGtin"
              label="Tertiary GTIN"
              placeholder=""
            />
            <FormInput
              control={control}
              name="secondaryGtin"
              label="Secondary GTIN"
              placeholder=""
            />
            <FormInput
              control={control}
              name="primaryGtin"
              label="Primary GTIN"
              placeholder=""
            />
          </div>
        </CardContent>
      </Card>

      {/* Right Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>
          <CardContent className="space-y-4">
            <FormInput
              control={control}
              name="minSaleRate"
              placeholder="0.00000"
              inputProps={{ type: "number", step: "0.00001" }}
              label="Min. Sale Rate"
            />

            <FormInput
              control={control}
              name="minSoQty"
              placeholder="0.000"
              inputProps={{ type: "number", step: "0.001" }}
              label="Min. S.O. Qty."
            />

            <FormInput
              control={control}
              name="minBatchQtyForAutoloading"
              placeholder="0.000"
              inputProps={{ type: "number", step: "0.001" }}
              label="Min. Batch Qty. for Autoloading"
            />

            <FormInput
              control={control}
              name="considerAsNewProductTill"
              placeholder="//"
              label="Consider as New Product till"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <FormInput
              control={control}
              name="interfaceCode"
              label="Interface Code"
              placeholder=""
            />
            <FormInput
              control={control}
              name="interfaceAdditional"
              label="Additional Interface"
              placeholder=""
            />
          </CardContent>
        </Card>

      </div>
    </div>
  )
} 