'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormSelect } from "@/components/shared/forms/form-select"

interface ItemStockAnalysisFormProps {
  control: any;
  itemId?: number;
}

export function ItemStockAnalysisForm({ control, itemId }: ItemStockAnalysisFormProps) {
  const abcOptions = [
    { label: 'Select ABC Classification', value: '0' },
    { label: 'A - High Value', value: 'A' },
    { label: 'B - Medium Value', value: 'B' },
    { label: 'C - Low Value', value: 'C' },
  ];

  const xyzOptions = [
    { label: 'Select XYZ Classification', value: '0' },
    { label: 'X - High Stock Value', value: 'X' },
    { label: 'Y - Medium Stock Value', value: 'Y' },
    { label: 'Z - Low Stock Value', value: 'Z' },
  ];

  const fsnOptions = [
    { label: 'Select FSN Classification', value: '0' },
    { label: 'F - Fast Moving', value: 'F' },
    { label: 'S - Slow Moving', value: 'S' },
    { label: 'N - Non Moving', value: 'N' },
  ];

  const vedOptions = [
    { label: 'Select VED Classification', value: '0' },
    { label: 'V - Vital', value: 'V' },
    { label: 'E - Essential', value: 'E' },
    { label: 'D - Desirable', value: 'D' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Stock Analysis Classifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            control={control}
            name="stockAnalysis.abcConsumptionValue"
            label="ABC (Consumption Value)"
            options={abcOptions}
            placeholder="Select ABC classification"
          />
          <FormSelect
            control={control}
            name="stockAnalysis.xyzStockValue"
            label="XYZ (Stock Value)"
            options={xyzOptions}
            placeholder="Select XYZ classification"
          />
          <FormSelect
            control={control}
            name="stockAnalysis.fsnMovement"
            label="FSN (Movement)"
            options={fsnOptions}
            placeholder="Select FSN classification"
          />
          <FormSelect
            control={control}
            name="stockAnalysis.vedAnalysis"
            label="VED (Criticality)"
            options={vedOptions}
            placeholder="Select VED classification"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>ABC Analysis:</strong> Based on consumption value (A=High, B=Medium, C=Low)
            <br />
            <strong>XYZ Analysis:</strong> Based on stock value variability (X=High, Y=Medium, Z=Low)
            <br />
            <strong>FSN Analysis:</strong> Based on movement frequency (F=Fast, S=Slow, N=Non-moving)
            <br />
            <strong>VED Analysis:</strong> Based on criticality (V=Vital, E=Essential, D=Desirable)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

