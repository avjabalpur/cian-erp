"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface CustomerBusinessTermsFormProps {
  customerId?: number;
}

export function CustomerBusinessTermsForm({ customerId }: CustomerBusinessTermsFormProps) {
  const form = useFormContext();

  if (!customerId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Terms</CardTitle>
          <CardDescription>Customer business terms and conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please save the customer first to add business terms.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Terms</CardTitle>
        <CardDescription>Customer business terms and conditions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="businessTerms.0.paymentTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Terms</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Net 30, COD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessTerms.0.creditLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Limit</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter credit limit" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="businessTerms.0.creditDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Days</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter credit days" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessTerms.0.discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter discount percentage" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
