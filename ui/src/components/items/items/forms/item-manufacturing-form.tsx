import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormSelect } from "@/components/shared/forms/form-select"

interface ItemManufacturingFormProps {
  control: any;
  itemId?: number;
}

export function ItemManufacturingForm({ control, itemId }: ItemManufacturingFormProps) {
  return (
    <div className="space-y-4">
      {/* Manufacturing Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Manufacturing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="stdAssayStrength"
              label="Standard Assay Strength"
              placeholder="Enter standard assay strength"
            />
            <FormInput
              control={control}
              name="mainProdCentre"
              label="Main Production Centre"
              placeholder="Enter main production centre"
            />
          </div>
        </CardContent>
      </Card>

      {/* Shelf Life */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Shelf Life</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="shelfLifeMonths"
              label="Shelf Life (Months)"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="shelfLifeDays"
              label="Shelf Life (Days)"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Standard Rates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Standard Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="stdRate"
              label="Standard Rate"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="stdLossOnDry"
              label="Standard Loss on Dry"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stock and Safety */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Stock and Safety</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="safetyStock"
              label="Safety Stock"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="allowedAllergenPercent"
              label="Allowed Allergen %"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Manufacturing Fees */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Manufacturing Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="stdMfgFeesPerUnit"
            label="Standard Manufacturing Fees Per Unit"
            placeholder="0.00"
            inputProps={{ type: "number", step: "0.01" }}
          />
        </CardContent>
      </Card>

      {/* Manufacturing Flags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Manufacturing Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="manufactured"
              label="Manufactured"
            />
            <FormSwitch
              control={control}
              name="qcRequired"
              label="QC Required"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="mfgDateApplicable"
              label="Manufacturing Date Applicable"
            />
            <FormSwitch
              control={control}
              name="expiryDateApplicable"
              label="Expiry Date Applicable"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="mfgLocNameRequired"
              label="Manufacturing Location Name Required"
            />
            <FormSwitch
              control={control}
              name="mfgMmYyyyApplicable"
              label="Manufacturing MM/YYYY Applicable"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="expiryMmYyyyApplicable"
              label="Expiry MM/YYYY Applicable"
            />
            <FormSwitch
              control={control}
              name="trackSerialNos"
              label="Track Serial Numbers"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 