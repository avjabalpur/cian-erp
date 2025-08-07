"use client";

import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerMasterFormData } from "@/validations/customer-master";

interface CustomerTaxComplianceFormProps {
  control: Control<CustomerMasterFormData>;
  customerId?: number;
}

export function CustomerTaxComplianceForm({ control, customerId }: CustomerTaxComplianceFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Tax & Compliance Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tax Configuration Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tax Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="taxCompliance.vatFormCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Form Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter VAT form code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.centralFormCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Central Form Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter central form code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.isEligibleForTcs"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Eligible for TCS</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.tcsType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TCS Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter TCS type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.isApplicableHigherRate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Applicable Higher Rate</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.isDeemedNonResident"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Deemed Non-Resident</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.isDeemedPermanentEstablishment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Deemed Permanent Establishment</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.isBillDiscount"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bill Discount</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.isReverseEndOfYear"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Reverse End of Year</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Interface & Document Configuration Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Interface & Document Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="taxCompliance.customerInterfaceCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Interface Code</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter interface code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.interfaceFileFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interface File Format</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter file format" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.projectionRatio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projection Ratio</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter projection ratio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.numberOfDisplays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Displays</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter number of displays" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.labelLayout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label Layout</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter label layout" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.numberOfCopies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Copies</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter number of copies" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="taxCompliance.documentsThrough"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documents Through</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter documents through" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="taxCompliance.specialTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Terms</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter special terms" {...field} />
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