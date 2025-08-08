import { useEffect } from "react";
import { useController } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormHorizontalRadioGroup } from "@/components/shared/forms/form-horizontal-radio-group"

interface ItemBoughtOutFormProps {
  control: any;
  itemId?: number;
}

export function ItemBoughtOutForm({ control, itemId }: ItemBoughtOutFormProps) {

  const purchaseBasedOnOptions = [
    { label: "Re-order Level", value: "Re-order Level" },
    { label: "M.R.P. Plan", value: "M.R.P. Plan" },
    { label: "Indents", value: "Indents" },
  ];

  return (
    <div className="space-y-4">
      {/* Purchase Based On */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Purchase Based On</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center">
            <label className="text-[12px] font-medium min-w-[170px]">Purchase Based On:</label>
            <FormHorizontalRadioGroup
              control={control}
              name="purchaseBasedOn"
              options={purchaseBasedOnOptions}
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-[12px] font-medium min-w-[150px]">Excess Planning %</label>
            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="excessPlanningPercent"
                label=""
                placeholder="0.00"
                inputProps={{ type: "number", step: "0.01" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Norms */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Inventory Norms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="text-[12px] font-medium min-w-[120px]">Re-order Level</label>
                <div className="flex-1 flex items-center space-x-2">
                  <FormInput
                    control={control}
                    name="boughtOutReorderLevel"
                    label=""
                    placeholder="0.000"
                    inputProps={{ type: "number", step: "0.001" }}
                  />
                  <span className="text-sm text-gray-500">NOS</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-[12px] font-medium min-w-[120px]">Min. Stock Level</label>
                <div className="flex-1 flex items-center space-x-2">
                  <FormInput
                    control={control}
                    name="minStockLevel"
                    label=""
                    placeholder="0.000"
                    inputProps={{ type: "number", step: "0.001" }}
                  />
                  <span className="text-sm text-gray-500">NOS</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-[12px] font-medium min-w-[120px]">Max. Stock Level</label>
                <div className="flex-1 flex items-center space-x-2">
                  <FormInput
                    control={control}
                    name="maxStockLevel"
                    label=""
                    placeholder="0.000"
                    inputProps={{ type: "number", step: "0.001" }}
                  />
                  <span className="text-sm text-gray-500">NOS</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="text-[12px] font-medium min-w-[200px]">Min. Bal Shelf Life in Days (from Receipt Date)</label>
                <div className="flex-1 flex items-center space-x-2">
                  <FormInput
                    control={control}
                    name="minBalanceShelfLifeDays"
                    label=""
                    placeholder=""
                    inputProps={{ type: "number" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Import Duties Percentage */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Default Import Duties Percentage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="text-[12px] font-medium min-w-[180px]">CUSTOM DUTY</label>
                <div className="flex-1 flex items-center space-x-2">
                  <FormInput
                    control={control}
                    name="customDutyPercent"
                    label=""
                    placeholder=""
                    inputProps={{ type: "number", step: "0.01" }}
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-[12px] font-medium min-w-[180px]">IGST</label>
                <div className="flex-1 flex items-center space-x-2">
                  <FormInput
                    control={control}
                    name="igstPercent"
                    label=""
                    placeholder=""
                    inputProps={{ type: "number", step: "0.01" }}
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-[12px] font-medium min-w-[180px]">SWS</label>
                <div className="flex-1 flex items-center space-x-2">
                  <FormInput
                    control={control}
                    name="swsPercent"
                    label=""
                    placeholder=""
                    inputProps={{ type: "number", step: "0.01" }}
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <p>Default % (on Assessable Value)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Max. Purchase Rate */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Max. Purchase Rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <label className="text-[12px] font-medium min-w-[150px]">Max. Purchase Rate</label>
            <div className="flex-1 flex items-center space-x-2">
              <FormInput
                control={control}
                name="maxPurchaseRate"
                label=""
                placeholder="0.00000"
                inputProps={{ type: "number", step: "0.00001" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stop Procurement */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Stop Procurement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <FormSwitch
              control={control}
              name="stopProcurement"
              label="Stop Procurement"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 