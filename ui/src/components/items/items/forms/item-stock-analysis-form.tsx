import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormHorizontalRadioGroup } from "@/components/shared/forms/form-horizontal-radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface ItemStockAnalysisFormProps {
  control: any;
  itemId?: number;
}

export function ItemStockAnalysisForm({ control, itemId }: ItemStockAnalysisFormProps) {

  const abcOptions = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "None", value: "none" },
  ];

  const xyzOptions = [
    { label: "X", value: "X" },
    { label: "Y", value: "Y" },
    { label: "Z", value: "Z" },
    { label: "None", value: "none" },
  ];

  const fsnOptions = [
    { label: "F", value: "F" },
    { label: "S", value: "S" },
    { label: "N", value: "N" },
    { label: "None", value: "none" },
  ];

  const vedOptions = [
    { label: "V", value: "V" },
    { label: "E", value: "E" },
    { label: "D", value: "D" },
    { label: "None", value: "none" },
  ];

  return (
    <div className="space-y-4">
      {/* Stock Analysis Criteria */}
      <Card>
        <CardContent className="space-y-4">
          {/* Instructional Banner */}
          <Alert className="bg-teal-600 text-white border-teal-600">
            <Info className="h-4 w-4" />
            <AlertDescription>
              You may categorise this Item for each of the following Criteria, so that this Item can be automatically be included in respective Reports by default.
            </AlertDescription>
          </Alert>

          {/* ABC Consumption Value */}
          <div className="flex items-center">
            <label className="text-[12px] font-medium min-w-[170px]">ABC Consumption Value:</label>
            <FormHorizontalRadioGroup
              control={control}
              name="abcConsumptionValue"
              options={abcOptions}
            />
          </div>

          {/* XYZ Stock Value */}
          <div className="flex items-center ">
            <label className="text-[12px] font-medium min-w-[170px]">XYZ Stock Value:</label>
            <FormHorizontalRadioGroup
              control={control}
              name="xyzStockValue"
              options={xyzOptions}
            />
          </div>

          {/* FSN Movement */}
          <div className="flex items-center ">
            <label className="text-[12px] font-medium min-w-[170px]">FSN Movement:</label>
            <FormHorizontalRadioGroup
              control={control}
              name="fsnMovement"
              options={fsnOptions}
            />
          </div>

          {/* VED Analysis */}
          <div className="flex items-center">
            <label className="text-[12px] font-medium min-w-[170px]">VED Analysis:</label>
            <FormHorizontalRadioGroup
              control={control}
              name="vedAnalysis"
              options={vedOptions}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 