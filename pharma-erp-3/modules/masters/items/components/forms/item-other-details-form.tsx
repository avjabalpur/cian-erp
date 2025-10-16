'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ItemOtherDetailsFormProps {
  control: any;
  itemId?: number;
}

export function ItemOtherDetailsForm({ control, itemId }: ItemOtherDetailsFormProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Other Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Additional details and custom fields will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

