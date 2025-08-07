"use client";

import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerMasterFormData } from "@/validations/customer-master";

interface CustomerBankingFormProps {
  control: Control<CustomerMasterFormData>;
  customerId?: number;
}

export function CustomerBankingForm({ control, customerId }: CustomerBankingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Banking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="bankingDetails.0.bankIfscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank IFSC Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IFSC code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bankingDetails.0.bankAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bankingDetails.0.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bankingDetails.0.customerBanker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Banker</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer banker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bankingDetails.0.customerVpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer VPA</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter VPA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bankingDetails.0.bankAccountTypeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bankingDetails.0.bankBranch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Branch</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank branch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bankingDetails.0.bankLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bankingDetails.0.isPrimary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Primary Banking Detail</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </Card>
      </CardContent>
    </Card>
  );
} 