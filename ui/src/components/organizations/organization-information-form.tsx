import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { useLocationTypes } from "@/hooks/use-location-types"

interface OrganizationInformationFormProps {
  control: any;
}

export function OrganizationInformationForm({ control }: OrganizationInformationFormProps) {
  const { data: locationTypes = [], isLoading: locationTypesLoading } = useLocationTypes()

  // Transform location types for the select options
  const locationTypeOptions = locationTypes.map(lt => ({
    value: lt.id.toString(),
    label: lt.name
  }))

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
              inputProps={{ type: "text", autoComplete: "off", maxLength: 10 }}
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
              options={locationTypeOptions}
              placeholder={locationTypesLoading ? "Loading..." : "Select location type"}
              disabled={locationTypesLoading}
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
              inputProps={{ type: "email", autoComplete: "email", maxLength: 100 }}
            />
            <FormInput
              control={control}
              name="phone"
              label="Phone"
              placeholder="Enter phone number"
              inputProps={{ type: "tel", autoComplete: "tel", maxLength: 15 }}
            />
            <FormInput
              control={control}
              name="website"
              label="Website"
              placeholder="Enter website URL"
              inputProps={{ type: "url", autoComplete: "url", maxLength: 100 }}
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
              inputProps={{ type: "text", autoComplete: "address-line1", maxLength: 100 }}
            />
            <FormInput
              control={control}
              name="address2"
              label="Address Line 2"
              placeholder="Enter address line 2"
              inputProps={{ type: "text", autoComplete: "address-line2", maxLength: 100 }}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                control={control}
                name="city"
                label="City"
                placeholder="Enter city"
                inputProps={{ type: "text", autoComplete: "address-level2", maxLength: 50 }}
              />
              <FormInput
                control={control}
                name="state"
                label="State"
                placeholder="Enter state"
                inputProps={{ type: "text", autoComplete: "address-level1", maxLength: 50 }}
              />
              <FormInput
                control={control}
                name="zip"
                label="ZIP Code"
                placeholder="Enter ZIP code"
                inputProps={{ type: "text", autoComplete: "postal-code", maxLength: 10 }}
              />
            </div>
            <FormInput
              control={control}
              name="country"
              label="Country"
              placeholder="Enter country"
              inputProps={{ type: "text", autoComplete: "country-name", maxLength: 50 }}
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
              inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
            />
            <FormInput
              control={control}
              name="panNumber"
              label="PAN Number"
              placeholder="Enter PAN number"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 10 }}
            />
            <FormInput
              control={control}
              name="tdsCycle"
              label="TDS Cycle"
              placeholder="Enter TDS cycle"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
            />
            <FormInput
              control={control}
              name="vatTinNumber"
              label="VAT/TIN Number"
              placeholder="Enter VAT/TIN number"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="employmentStatusCode"
              label="Employment Status Code"
              placeholder="Enter employment status code"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
            />
            <FormInput
              control={control}
              name="esiOfficeCode"
              label="ESI Office Code"
              placeholder="Enter ESI office code"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
            />
            <FormInput
              control={control}
              name="cinNumber"
              label="CIN Number"
              placeholder="Enter CIN number"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
            />
            <FormInput
              control={control}
              name="licenseNumber"
              label="License Number"
              placeholder="Enter license number"
              inputProps={{ type: "text", autoComplete: "off", maxLength: 50 }}
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
