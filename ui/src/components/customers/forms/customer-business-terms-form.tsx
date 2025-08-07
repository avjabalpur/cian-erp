"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerBusinessTermsFormProps {
  customerId?: number;
}

export function CustomerBusinessTermsForm({ customerId }: CustomerBusinessTermsFormProps) {
  if (!customerId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Terms</CardTitle>
          <CardDescription>
            Customer business terms will be available after saving the customer
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Terms</CardTitle>
        <CardDescription>
          Manage customer business terms, credit limits, and payment terms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Business terms management coming soon...
        </div>
      </CardContent>
    </Card>
  );
}
