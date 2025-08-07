"use client";

import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerMasterFormData } from "@/validations/customer-master";

interface CustomerBusinessTermsFormProps {
  control: Control<CustomerMasterFormData>;
  customerId?: number;
}

export function CustomerBusinessTermsForm({ control, customerId }: CustomerBusinessTermsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Business Terms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shipping & Logistics Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Shipping & Logistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="businessTerms.destinationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter destination code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.transportModeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Mode Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter transport mode code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.transporterCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporter Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter transporter code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.leadDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Days</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter lead days" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.customerDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Distance</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter distance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.freightIndicator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Freight Indicator</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter freight indicator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.supplyStockLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supply Stock Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter supply stock location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.allowConsignmentOnBooking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Allow Consignment on Booking</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Financial Terms Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Financial Terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="businessTerms.customerAccountCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Account Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.creditLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Limit</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter credit limit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.minimumInvoiceAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Invoice Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter minimum amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.customerSchemeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Scheme Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter scheme code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.customerBrokerCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Broker Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter broker code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.customerBrokerRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Broker Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter broker rate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.cashDiscountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cash Discount Percentage (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter discount percentage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.miscChargePercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Misc Charge Percentage (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter misc charge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.miscDiscountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Misc Discount Percentage (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter misc discount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.paymentTermCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Term Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter payment term code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.creditPeriodDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Period (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter credit period" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.newPartyCreditPeriodDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Party Credit Period (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter new party credit period" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.isOverdueCheck"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Overdue Check</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.numberOfBills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Bills</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter number of bills" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.outstandingBillPeriodDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outstanding Bill Period (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter outstanding bill period" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessTerms.outstandingBillAccountIndicator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outstanding Bill Account Indicator</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account indicator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 