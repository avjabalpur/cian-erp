"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerTaxComplianceFormProps {
  customerId?: number;
}

export function CustomerTaxComplianceForm({ customerId }: CustomerTaxComplianceFormProps) {
  if (!customerId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tax Compliance</CardTitle>
          <CardDescription>
            Customer tax compliance will be available after saving the customer
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Compliance</CardTitle>
        <CardDescription>
          Manage customer tax compliance and regulatory requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Tax compliance management coming soon...
        </div>
      </CardContent>
    </Card>
  );
}
