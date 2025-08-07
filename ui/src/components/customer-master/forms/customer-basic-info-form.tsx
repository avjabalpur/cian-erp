"use client";

import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerMasterFormData } from "@/validations/customer-master";

interface CustomerBasicInfoFormProps {
  control: Control<CustomerMasterFormData>;
}

export function CustomerBasicInfoForm({ control }: CustomerBasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="locationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="customerNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="customerCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Code *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="shortName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter short name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="payeeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payee Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter payee name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="customerTypeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="segmentCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segment Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter segment code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="incomeTaxPanNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Income Tax PAN Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter PAN number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="customerSaleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Sale Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter sale type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="exportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Export Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter export type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="gstin"
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
            control={control}
            name="drugLicenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drug License Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter drug license number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="drugLicenseExpiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drug License Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="otherLicenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other License Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter other license number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="oldCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter old code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="customerLotNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Lot Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter lot number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="continent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Continent</FormLabel>
                <FormControl>
                  <Input placeholder="Enter continent" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="rebates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rebates</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter rebates information" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="externalInformation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External Information</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter external information" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={control}
            name="stopInvoice"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Stop Invoice</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="isExportCustomer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Export Customer</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="isRegisteredDealer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Registered Dealer</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="isRecordClosed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Record Closed</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
} 