import { useEffect } from "react";
import { useController } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormSelect } from "@/components/shared/forms/form-select"

interface ItemBoughtOutFormProps {
  control: any;
  itemId?: number;
}

export function ItemBoughtOutForm({ control, itemId }: ItemBoughtOutFormProps) {
  // For now, we'll use the main item data since bought out details are part of the main item
  // In the future, if there's a separate bought out details hook, we can use it here

  const purchaseBasedOnOptions = [
    { label: "Select purchase basis", value: "-1" },
    { label: "Stock Level", value: "STOCK" },
    { label: "Demand", value: "DEMAND" },
    { label: "Forecast", value: "FORECAST" },
  ];

  return (
    <div className="space-y-4">
      {/* Purchase Planning */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Purchase Planning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSelect
              control={control}
              name="purchaseBasedOn"
              label="Purchase Based On"
              options={purchaseBasedOnOptions}
            />
            <FormInput
              control={control}
              name="excessPlanningPercent"
              label="Excess Planning %"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stock Levels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Stock Levels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="reorderLevel"
              label="Reorder Level"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="minStockLevel"
              label="Min Stock Level"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="maxStockLevel"
              label="Max Stock Level"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Shelf Life */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Shelf Life</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="minBalanceShelfLifeDays"
            label="Min Balance Shelf Life (Days)"
            placeholder="0"
            inputProps={{ type: "number" }}
          />
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tax Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="customDutyPercent"
              label="Custom Duty %"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="igstPercent"
              label="IGST %"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="swsPercent"
              label="SWS %"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Purchase Rate */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Purchase Rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="maxPurchaseRate"
              label="Max Purchase Rate"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
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