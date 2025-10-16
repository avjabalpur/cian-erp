'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ItemMediaFormProps {
  control: any;
  itemId?: number;
}

export function ItemMediaForm({ control, itemId }: ItemMediaFormProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Media & Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Media upload functionality will be available here for product images, documents, and other attachments.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

