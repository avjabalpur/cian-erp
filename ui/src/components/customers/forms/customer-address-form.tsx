"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";
import { Control } from "react-hook-form";
import { CustomerFormData } from "@/validations/customer";

interface CustomerAddressFormProps {
  control: Control<CustomerFormData>;
  customerId?: number;
}

export function CustomerAddressForm({ control, customerId }: CustomerAddressFormProps) {
  return (
    <Card className="pt-3">
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            control={control}
            name="addresses.0.contactPerson"
            label="Contact Person"
            placeholder="Enter contact person name"
          />

          <FormInput
            control={control}
            name="addresses.0.telephoneNumber"
            label="Telephone Number"
            placeholder="Enter telephone number"
          />

          <FormInput
            control={control}
            name="addresses.0.mobileNumber"
            label="Mobile Number"
            placeholder="Enter mobile number"
          />

          <FormInput
            control={control}
            name="addresses.0.emailId"
            label="Email"
            placeholder="Enter email address"
            inputProps={{ type: "email" }}
          />

          <FormInput
            control={control}
            name="addresses.0.website"
            label="Website"
            placeholder="Enter website URL"
          />

          <FormInput
            control={control}
            name="addresses.0.faxNumber"
            label="Fax Number"
            placeholder="Enter fax number"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            control={control}
            name="addresses.0.addressLine1"
            label="Address Line 1"
            placeholder="Enter address line 1"
          />

          <FormInput
            control={control}
            name="addresses.0.addressLine2"
            label="Address Line 2"
            placeholder="Enter address line 2"
          />

          <FormInput
            control={control}
            name="addresses.0.addressLine3"
            label="Address Line 3"
            placeholder="Enter address line 3"
          />

          <FormInput
            control={control}
            name="addresses.0.city"
            label="City"
            placeholder="Enter city"
          />

          <FormInput
            control={control}
            name="addresses.0.stateCode"
            label="State Code"
            placeholder="Enter state code"
          />

          <FormInput
            control={control}
            name="addresses.0.zipCode"
            label="ZIP Code"
            placeholder="Enter ZIP code"
          />

          <FormInput
            control={control}
            name="addresses.0.country"
            label="Country"
            placeholder="Enter country"
          />

          <FormInput
            control={control}
            name="addresses.0.gstStateCode"
            label="GST State Code"
            placeholder="Enter GST state code"
          />
        </div>

        <FormCheckbox
          control={control}
          name="addresses.0.isPrimary"
          label="Primary Address"
          description="Mark this as the primary address for the customer"
          className="rounded-md border p-4"
        />
      </CardContent>
    </Card>
  );
}
