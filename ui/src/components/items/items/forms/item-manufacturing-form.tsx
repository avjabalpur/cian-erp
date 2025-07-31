import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"

interface ItemManufacturingFormProps {
  control: any;
}

export function ItemManufacturingForm({ control }: ItemManufacturingFormProps) {
  return (
    <div className="space-y-4">
      {/* Quality & Standards */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quality & Standards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="stdAssayStrength"
              label="Std. Assay/Strength"
              placeholder="Enter assay strength"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="stdLossOnDry"
              label="Std Loss on Dry"
              placeholder="0.000"
              inputProps={{ type: "number", step: "0.001" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="shelfLifeMonths"
              label="Shelf Life (Months)"
              placeholder="24"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="shelfLifeDays"
              label="Shelf Life (Days)"
              placeholder="732"
              inputProps={{ type: "number" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="stdRate"
              label="Std. Rate"
              placeholder="26.00000 RS"
              inputProps={{ type: "number", step: "0.00001" }}
            />
            <FormInput
              control={control}
              name="safetyStock"
              label="Safety Stock"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Manufacturing Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Manufacturing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="allowedAllergenPercent"
              label="Allowed Allergen %"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="stdMfgFeesUnit"
              label="Std. Mfg. Fees/Unit"
              placeholder="2.00000 RS"
              inputProps={{ type: "number", step: "0.00001" }}
            />
          </div>

          <FormInput
            control={control}
            name="mainProdCentre"
            label="Main Prod. Centre"
            placeholder="Enter production centre"
          />
        </CardContent>
      </Card>

      {/* Quality Control */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quality Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="qcRequired"
              label="Q.C. Required"
            />
            <FormSwitch
              control={control}
              name="allergen"
              label="Allergen"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="mfgDateApplicable"
              label="Mfg. Date Applicable"
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
              name="trackSerialNos"
              label="Track Serial Nos."
            />
            <FormSwitch
              control={control}
              name="mfgLocNameRequired"
              label="Mfg. Loc/Name Required"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="mfgMmyyApplicable"
              label="Mfg. MMYY Applicable"
            />
            <FormSwitch
              control={control}
              name="expiryMmyyApplicable"
              label="Expiry MMYY Applicable"
            />
          </div>
        </CardContent>
      </Card>

      {/* Other Flags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Other Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="batchNotApplicable"
              label="Batch Not Applicable (NA)"
            />
            <FormSwitch
              control={control}
              name="packingFreightInsurance"
              label="Packing,Freight and Insurance Services"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="activeIngredient"
              label="Active Ingredient"
            />
            <FormSwitch
              control={control}
              name="principalItemStatutory"
              label="Principal Item for Statutory Reporting"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 