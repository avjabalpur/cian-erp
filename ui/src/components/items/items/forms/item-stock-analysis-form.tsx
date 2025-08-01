import { useEffect } from "react";
import { useController } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormTextarea } from "@/components/shared/forms/form-textarea"
import { useItemStockAnalysisByItemId } from "@/hooks/items/use-item-stock-analysis"

interface ItemStockAnalysisFormProps {
  control: any;
  itemId?: number;
}

export function ItemStockAnalysisForm({ control, itemId }: ItemStockAnalysisFormProps) {
  // Fetch item stock analysis data
  const { data: stockData, isLoading } = useItemStockAnalysisByItemId(itemId || 0);
  
  // Use controller to programmatically set form values
  const { field: currentStockField } = useController({
    name: "currentStock",
    control,
  });

  const { field: minimumStockField } = useController({
    name: "minimumStock",
    control,
  });

  const { field: maximumStockField } = useController({
    name: "maximumStock",
    control,
  });

  const { field: reorderPointField } = useController({
    name: "reorderPoint",
    control,
  });

  const { field: averageConsumptionField } = useController({
    name: "averageConsumption",
    control,
  });

  const { field: leadTimeField } = useController({
    name: "leadTime",
    control,
  });

  // Populate form when stock data is loaded
  useEffect(() => {
    if (stockData && itemId && stockData.length > 0) {
      // Take the first stock analysis record
      const firstStockData = stockData[0];
      currentStockField.onChange(firstStockData.currentStock?.toString() || "");
      minimumStockField.onChange(firstStockData.minimumStock?.toString() || "");
      maximumStockField.onChange(firstStockData.maximumStock?.toString() || "");
      reorderPointField.onChange(firstStockData.reorderPoint?.toString() || "");
      averageConsumptionField.onChange(firstStockData.averageConsumption?.toString() || "");
      leadTimeField.onChange(firstStockData.leadTime?.toString() || "");
    }
  }, [stockData, itemId, currentStockField, minimumStockField, maximumStockField, reorderPointField, averageConsumptionField, leadTimeField]);

  if (isLoading && itemId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-500">Loading stock analysis...</div>
      </div>
    );
  }

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