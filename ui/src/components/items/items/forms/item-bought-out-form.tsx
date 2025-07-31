import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormRadioGroup } from "@/components/shared/forms/form-radio-group"

interface ItemBoughtOutFormProps {
  control: any;
}

export function ItemBoughtOutForm({ control }: ItemBoughtOutFormProps) {
  return (
    <div className="space-y-4">
      {/* Purchase Based On */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Purchase Based On</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormRadioGroup
            control={control}
            name="purchaseBasedOn"
            label="Purchase Planning Method"
            options={[
              { value: "reorderLevel", label: "Re-order Level" },
              { value: "mrpPlan", label: "M.R.P. Plan" },
              { value: "indents", label: "Indents" },
            ]}
          />
          
          <FormInput
            control={control}
            name="excessPlanningPercent"
            label="Excess Planning %"
            placeholder="0.00"
            inputProps={{ type: "number", step: "0.01" }}
          />
        </CardContent>
      </Card>

      {/* Inventory Norms */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Inventory Norms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="reorderLevel"
              label="Re-order Level"
              placeholder="0.000 NOS"
              inputProps={{ type: "number", step: "0.001" }}
            />
            <FormInput
              control={control}
              name="minStockLevel"
              label="Min. Stock Level"
              placeholder="0.000 NOS"
              inputProps={{ type: "number", step: "0.001" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="maxStockLevel"
              label="Max. Stock Level"
              placeholder="0.000 NOS"
              inputProps={{ type: "number", step: "0.001" }}
            />
            <FormInput
              control={control}
              name="minBalShelfLifeDays"
              label="Min. Bal Shelf Life in Days (from Receipt Date)"
              placeholder="Enter days"
              inputProps={{ type: "number" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Default Import Duties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Default Import Duties Percentage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="customDutyPercent"
              label="Custom Duty % (on Assessable Value)"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="igstPercent"
              label="IGST % (on Assessable Value)"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>

          <FormInput
            control={control}
            name="swsPercent"
            label="SWS % (on Assessable Value)"
            placeholder="0.00"
            inputProps={{ type: "number", step: "0.01" }}
          />
        </CardContent>
      </Card>

      {/* Purchase Rate */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Purchase Rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="maxPurchaseRate"
            label="Max. Purchase Rate"
            placeholder="0.00000"
            inputProps={{ type: "number", step: "0.00001" }}
          />
        </CardContent>
      </Card>

      {/* Procurement Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Procurement Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormSwitch
            control={control}
            name="stopProcurement"
            label="Stop Procurement"
          />
        </CardContent>
      </Card>
    </div>
  );
} 