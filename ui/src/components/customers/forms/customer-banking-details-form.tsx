"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerBankingDetailsFormProps {
  customerId?: number;
}

export function CustomerBankingDetailsForm({ customerId }: CustomerBankingDetailsFormProps) {
  if (!customerId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Banking Details</CardTitle>
          <CardDescription>
            Customer banking details will be available after saving the customer
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banking Details</CardTitle>
        <CardDescription>
          Manage customer banking information and payment details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Banking details management coming soon...
        </div>
      </CardContent>
    </Card>
  );
}
