import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormRadioGroup } from "@/components/shared/forms/form-radio-group"

interface ItemStockAnalysisFormProps {
  control: any;
}

export function ItemStockAnalysisForm({ control }: ItemStockAnalysisFormProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Stock Analysis Criteria</CardTitle>
          <p className="text-sm text-muted-foreground">
            You may categorise this Item for each of the following Criteria, so that this Item can be automatically be included in respective Reports by default.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormRadioGroup
            control={control}
            name="abcConsumptionValue"
            label="ABC Consumption Value"
            options={[
              { value: "A", label: "A" },
              { value: "B", label: "B" },
              { value: "C", label: "C" },
              { value: "None", label: "None" },
            ]}
          />

          <FormRadioGroup
            control={control}
            name="xyzStockValue"
            label="XYZ Stock Value"
            options={[
              { value: "X", label: "X" },
              { value: "Y", label: "Y" },
              { value: "Z", label: "Z" },
              { value: "None", label: "None" },
            ]}
          />

          <FormRadioGroup
            control={control}
            name="fsnMovement"
            label="FSN Movement"
            options={[
              { value: "F", label: "F" },
              { value: "S", label: "S" },
              { value: "N", label: "N" },
              { value: "None", label: "None" },
            ]}
          />

          <FormRadioGroup
            control={control}
            name="vedAnalysis"
            label="VED Analysis"
            options={[
              { value: "V", label: "V" },
              { value: "E", label: "E" },
              { value: "D", label: "D" },
              { value: "None", label: "None" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
} 