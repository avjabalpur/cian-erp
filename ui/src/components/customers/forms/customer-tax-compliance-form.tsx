"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

interface CustomerTaxComplianceFormProps {
  customerId?: number;
}

export function CustomerTaxComplianceForm({ customerId }: CustomerTaxComplianceFormProps) {
  const form = useFormContext();

  if (!customerId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tax Compliance</CardTitle>
          <CardDescription>Customer tax compliance information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please save the customer first to add tax compliance details.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Compliance</CardTitle>
        <CardDescription>Customer tax compliance information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="taxCompliance.0.gstin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GSTIN</FormLabel>
                <FormControl>
                  <Input placeholder="Enter GSTIN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxCompliance.0.panNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter PAN number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="taxCompliance.0.taxRegistrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tax registration number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxCompliance.0.taxCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="REGISTERED">Registered</SelectItem>
                    <SelectItem value="UNREGISTERED">Unregistered</SelectItem>
                    <SelectItem value="COMPOSITION">Composition</SelectItem>
                    <SelectItem value="EXEMPTED">Exempted</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
