'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"

interface ItemBoughtOutFormProps {
  control: any;
  itemId?: number;
}

export function ItemBoughtOutForm({ control, itemId }: ItemBoughtOutFormProps) {
  return (
    <div className="space-y-4">
      {/* Purchase Based On */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            control={control}
            name="boughtOutDetails.purchaseBasedOn"
            label="Purchase Based On"
            placeholder="e.g., Re-order Level, M.R.P. Plan"
          />
          <FormInput
            control={control}
            name="boughtOutDetails.excessPlanningPercent"
            label="Excess Planning %"
            placeholder="0.00"
            inputProps={{ type: "number", step: "0.01" }}
          />
        </CardContent>
      </Card>

      {/* Inventory Norms */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Norms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="boughtOutDetails.reorderLevel"
              label="Re-order Level"
              placeholder="0.000"
              inputProps={{ type: "number", step: "0.001" }}
            />
            <FormInput
              control={control}
              name="boughtOutDetails.minStockLevel"
              label="Min. Stock Level"
              placeholder="0.000"
              inputProps={{ type: "number", step: "0.001" }}
            />
            <FormInput
              control={control}
              name="boughtOutDetails.maxStockLevel"
              label="Max. Stock Level"
              placeholder="0.000"
              inputProps={{ type: "number", step: "0.001" }}
            />
          </div>
          <FormInput
            control={control}
            name="boughtOutDetails.minBalanceShelfLifeDays"
            label="Min. Balance Shelf Life (Days)"
            placeholder="0"
            inputProps={{ type: "number" }}
          />
        </CardContent>
      </Card>

      {/* Tax Details */}
      <Card>
        <CardHeader>
          <CardTitle>Tax & Cost Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="boughtOutDetails.customDutyPercent"
              label="Custom Duty %"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="boughtOutDetails.igstPercent"
              label="IGST %"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="boughtOutDetails.swsPercent"
              label="SWS %"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>
          <FormInput
            control={control}
            name="boughtOutDetails.maxPurchaseRate"
            label="Max. Purchase Rate"
            placeholder="0.00000"
            inputProps={{ type: "number", step: "0.00001" }}
          />
          <FormSwitch
            control={control}
            name="boughtOutDetails.stopProcurement"
            label="Stop Procurement"
          />
        </CardContent>
      </Card>
    </div>
  )
}

