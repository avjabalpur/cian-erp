'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";

interface CustomerBusinessTermsFormProps {
  control: any;
  customerId?: number;
}

export function CustomerBusinessTermsForm({ control, customerId }: CustomerBusinessTermsFormProps) {
  return (
    <div className="space-y-4">
      {/* Transport & Logistics */}
      <Card>
        <CardHeader>
          <CardTitle>Transport & Logistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="destinationCode"
              label="Destination Code"
              placeholder="Enter destination code"
            />
            <FormInput
              control={control}
              name="transportModeCode"
              label="Transport Mode"
              placeholder="e.g., Road, Rail, Air"
            />
            <FormInput
              control={control}
              name="transporterCode"
              label="Transporter Code"
              placeholder="Enter transporter code"
            />
            <FormInput
              control={control}
              name="leadDays"
              label="Lead Days"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="customerDistance"
              label="Customer Distance (km)"
              placeholder="0"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="freightIndicator"
              label="Freight Indicator"
              placeholder="Enter freight indicator"
            />
          </div>
          <FormInput
            control={control}
            name="supplyStockLocation"
            label="Supply Stock Location"
            placeholder="Enter supply stock location"
          />
          <FormCheckbox
            control={control}
            name="allowConsignmentOnBooking"
            label="Allow Consignment on Booking"
          />
        </CardContent>
      </Card>

      {/* Credit & Financial Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Credit & Financial Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="customerAccountCode"
              label="Customer Account Code"
              placeholder="Enter account code"
            />
            <FormInput
              control={control}
              name="creditLimit"
              label="Credit Limit"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="minimumInvoiceAmount"
              label="Minimum Invoice Amount"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="paymentTermCode"
              label="Payment Term Code"
              placeholder="Enter payment term code"
            />
            <FormInput
              control={control}
              name="creditPeriodDays"
              label="Credit Period (Days)"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="newPartyCreditPeriodDays"
              label="New Party Credit Period (Days)"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Discount & Charges */}
      <Card>
        <CardHeader>
          <CardTitle>Discount & Charges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="customerSchemeCode"
              label="Customer Scheme Code"
              placeholder="Enter scheme code"
            />
            <FormInput
              control={control}
              name="customerBrokerCode"
              label="Customer Broker Code"
              placeholder="Enter broker code"
            />
            <FormInput
              control={control}
              name="customerBrokerRate"
              label="Broker Rate (%)"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="cashDiscountPercentage"
              label="Cash Discount (%)"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="miscChargePercentage"
              label="Misc. Charge (%)"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="miscDiscountPercentage"
              label="Misc. Discount (%)"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Outstanding Management */}
      <Card>
        <CardHeader>
          <CardTitle>Outstanding Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormCheckbox
            control={control}
            name="isOverdueCheck"
            label="Overdue Check"
            description="Enable overdue checking for this customer"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="numberOfBills"
              label="Number of Bills"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="outstandingBillPeriodDays"
              label="Outstanding Bill Period (Days)"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="outstandingBillAccountIndicator"
              label="Outstanding Bill Account Indicator"
              placeholder="Enter indicator"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

