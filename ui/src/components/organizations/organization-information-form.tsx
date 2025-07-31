import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormSwitch } from "@/components/shared/forms/form-switch"

interface OrganizationInformationFormProps {
  control: any;
}

export function OrganizationInformationForm({ control }: OrganizationInformationFormProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="code"
              label="Organization Code"
              placeholder="Enter organization code"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 20 }}
              required
            />
            <FormInput
              control={control}
              name="name"
              label="Organization Name"
              placeholder="Enter organization name"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 100 }}
              required
            />
            <FormSelect
              control={control}
              name="locationTypeId"
              label="Location Type"
              options={[
                { value: "1", label: 'Head Office' },
                { value: "2", label: 'Branch Office' },
                { value: "3", label: 'Warehouse' },
                { value: "4", label: 'Factory' },
              ]}
              placeholder="Select location type"
            />
            <FormInput
              control={control}
              name="contactPerson"
              label="Contact Person"
              placeholder="Enter contact person name"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 100 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="email"
              label="Email"
              placeholder="Enter email address"
              inputProps={{ type: "email", autoComplete: "email" }}
            />
            <FormInput
              control={control}
              name="phone"
              label="Phone"
              placeholder="Enter phone number"
              inputProps={{ type: "tel", autoComplete: "tel" }}
            />
            <FormInput
              control={control}
              name="website"
              label="Website"
              placeholder="Enter website URL"
              inputProps={{ type: "url", autoComplete: "url" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FormInput
              control={control}
              name="address1"
              label="Address Line 1"
              placeholder="Enter address line 1"
              inputProps={{ type: "text", autoComplete: "address-line1" }}
            />
            <FormInput
              control={control}
              name="address2"
              label="Address Line 2"
              placeholder="Enter address line 2"
              inputProps={{ type: "text", autoComplete: "address-line2" }}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                control={control}
                name="city"
                label="City"
                placeholder="Enter city"
                inputProps={{ type: "text", autoComplete: "address-level2" }}
              />
              <FormInput
                control={control}
                name="state"
                label="State"
                placeholder="Enter state"
                inputProps={{ type: "text", autoComplete: "address-level1" }}
              />
              <FormInput
                control={control}
                name="zip"
                label="ZIP Code"
                placeholder="Enter ZIP code"
                inputProps={{ type: "text", autoComplete: "postal-code" }}
              />
            </div>
            <FormInput
              control={control}
              name="country"
              label="Country"
              placeholder="Enter country"
              inputProps={{ type: "text", autoComplete: "country-name" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="gstinNumber"
              label="GSTIN Number"
              placeholder="Enter GSTIN number"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 15 }}
            />
            <FormInput
              control={control}
              name="panNumber"
              label="PAN Number"
              placeholder="Enter PAN number"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 10 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <FormSwitch
            control={control}
            name="isActive"
            label="Active"
          />
        </CardContent>
      </Card>
    </div>
  )
}
