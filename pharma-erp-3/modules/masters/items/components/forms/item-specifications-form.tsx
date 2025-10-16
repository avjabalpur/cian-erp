'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormTextArea } from "@/components/shared/forms/form-text-area"

interface ItemSpecificationsFormProps {
  control: any;
  itemId?: number;
}

export function ItemSpecificationsForm({ control, itemId }: ItemSpecificationsFormProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Item Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            control={control}
            name="specification.specification"
            label="Specifications"
            placeholder="Enter detailed specifications for this item..."
            rows={15}
          />
          <p className="text-sm text-muted-foreground">
            Include technical specifications, standards, quality parameters, and any other relevant details.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

