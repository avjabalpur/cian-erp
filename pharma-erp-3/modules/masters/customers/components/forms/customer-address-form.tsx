'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";

interface CustomerAddressFormProps {
  control: any;
  customerId?: number;
}

export function CustomerAddressForm({ control, customerId }: CustomerAddressFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            control={control}
            name="addressLine1"
            label="Address Line 1"
            placeholder="Enter address line 1"
          />
          <FormInput
            control={control}
            name="addressLine2"
            label="Address Line 2"
            placeholder="Enter address line 2"
          />
          <FormInput
            control={control}
            name="addressLine3"
            label="Address Line 3"
            placeholder="Enter address line 3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            control={control}
            name="city"
            label="City"
            placeholder="Enter city"
          />
          <FormInput
            control={control}
            name="stateCode"
            label="State Code"
            placeholder="Enter state code"
          />
          <FormInput
            control={control}
            name="zipCode"
            label="ZIP Code"
            placeholder="Enter ZIP code"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="country"
            label="Country"
            placeholder="Enter country"
          />
          <FormInput
            control={control}
            name="gstStateCode"
            label="GST State Code"
            placeholder="Enter GST state code"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="contactPerson"
            label="Contact Person"
            placeholder="Enter contact person"
          />
          <FormInput
            control={control}
            name="telephoneNumber"
            label="Telephone Number"
            placeholder="Enter telephone number"
          />
          <FormInput
            control={control}
            name="mobileNumber"
            label="Mobile Number"
            placeholder="Enter mobile number"
          />
          <FormInput
            control={control}
            name="faxNumber"
            label="Fax Number"
            placeholder="Enter fax number"
          />
          <FormInput
            control={control}
            name="emailId"
            label="Email"
            placeholder="Enter email address"
            inputProps={{ type: "email" }}
          />
          <FormInput
            control={control}
            name="website"
            label="Website"
            placeholder="Enter website URL"
            inputProps={{ type: "url" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

