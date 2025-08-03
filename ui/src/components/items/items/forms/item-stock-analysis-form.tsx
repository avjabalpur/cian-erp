import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"


interface ItemStockAnalysisFormProps {
  control: any;
  itemId?: number;
}

export function ItemStockAnalysisForm({ control, itemId }: ItemStockAnalysisFormProps) {

  return (
    <div className="space-y-4">
      {/* Current Stock */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Current Stock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="currentStock"
            label="Current Stock"
            placeholder="0"
            inputProps={{ type: "number" }}
          />
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
              name="minimumStock"
              label="Minimum Stock"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="maximumStock"
              label="Maximum Stock"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="reorderPoint"
              label="Reorder Point"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Consumption Analysis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Consumption Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="averageConsumption"
              label="Average Consumption"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="leadTime"
              label="Lead Time (Days)"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 