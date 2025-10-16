'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";
import { FormTextArea } from "@/components/shared/forms/form-text-area";

interface CustomerTaxComplianceFormProps {
  control: any;
  customerId?: number;
}

export function CustomerTaxComplianceForm({ control, customerId }: CustomerTaxComplianceFormProps) {
  return (
    <div className="space-y-4">
      {/* Tax Forms & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Forms & Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="vatFormCode"
              label="VAT Form Code"
              placeholder="Enter VAT form code"
            />
            <FormInput
              control={control}
              name="centralFormCode"
              label="Central Form Code"
              placeholder="Enter central form code"
            />
            <FormInput
              control={control}
              name="tcsType"
              label="TCS Type"
              placeholder="Enter TCS type"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormCheckbox
              control={control}
              name="isEligibleForTcs"
              label="Eligible for TCS"
            />
            <FormCheckbox
              control={control}
              name="isApplicableHigherRate"
              label="Applicable Higher Rate"
            />
            <FormCheckbox
              control={control}
              name="isDeemedNonResident"
              label="Deemed Non-Resident"
            />
            <FormCheckbox
              control={control}
              name="isDeemedPermanentEstablishment"
              label="Deemed Permanent Establishment"
            />
            <FormCheckbox
              control={control}
              name="isBillDiscount"
              label="Bill Discount"
            />
            <FormCheckbox
              control={control}
              name="isReverseEndOfYear"
              label="Reverse End of Year"
            />
          </div>
        </CardContent>
      </Card>

      {/* Interface & Reporting */}
      <Card>
        <CardHeader>
          <CardTitle>Interface & Reporting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="customerInterfaceCode"
              label="Interface Code"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="interfaceFileFormat"
              label="Interface File Format"
              placeholder="e.g., XML, JSON"
            />
            <FormInput
              control={control}
              name="projectionRatio"
              label="Projection Ratio"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="numberOfDisplays"
              label="Number of Displays"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="labelLayout"
              label="Label Layout"
              placeholder="Enter label layout"
            />
            <FormInput
              control={control}
              name="numberOfCopies"
              label="Number of Copies"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>

          <FormTextArea
            control={control}
            name="specialTerms"
            label="Special Terms"
            placeholder="Enter special terms"
            rows={3}
          />
          
          <FormInput
            control={control}
            name="documentsThrough"
            label="Documents Through"
            placeholder="Enter document routing"
          />
        </CardContent>
      </Card>
    </div>
  );
}

