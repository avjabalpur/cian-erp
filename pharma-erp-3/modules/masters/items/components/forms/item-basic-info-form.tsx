'use client';

import { Card, CardContent } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { useItemTypes } from "@/modules/masters/item-types/hooks"

interface ItemBasicInfoFormProps {
  control: any;
  itemId?: number;
}

export function ItemBasicInfoForm({ control, itemId }: ItemBasicInfoFormProps) {
  const { data: itemTypesData } = useItemTypes();
  const itemTypes = itemTypesData?.items || [];

  const itemTypeOptions = [
    { label: 'Select Item Type', value: '0' },
    ...itemTypes.map(it => ({ label: `${it.code} - ${it.name}`, value: String(it.id) }))
  ];

  const uqcOptions = [
    { label: "Select UQC", value: "0" },
    { label: "KGS - Kilograms", value: "KGS" },
    { label: "NOS - Numbers", value: "NOS" },
    { label: "LTR - Liters", value: "LTR" },
    { label: "MTR - Meters", value: "MTR" },
  ];

  return (
    <div className="space-y-4">
      {/* Top Row - Item Type, Sub-Type, GS Ind, HSN, UQC */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <FormSelect
          control={control}
          name="itemTypeId"
          label="Item Type"
          options={itemTypeOptions}
          required
        />
        <FormInput
          control={control}
          name="subType"
          label="Sub-Type"
          placeholder="Enter sub-type"
          inputProps={{ type: "number" }}
        />
        <FormInput
          control={control}
          name="gsInd"
          label="GS Ind."
          placeholder="Enter GS indicator"
        />
        <FormInput
          control={control}
          name="revNo"
          label="HSN"
          placeholder="Enter HSN code"
        />
        <FormSelect
          control={control}
          name="unitOfMeasure"
          label="UQC"
          options={uqcOptions}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Names and UOMs */}
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <FormInput
                control={control}
                name="itemName"
                label="Item Name"
                placeholder="Enter item name"
                required
              />
              <FormInput
                control={control}
                name="shortName"
                label="Short Name"
                placeholder="Enter short name"
              />
              <FormInput
                control={control}
                name="pharmacopoeiaName"
                label="Pharmacopeia Name"
                placeholder="Enter pharmacopeia name"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  control={control}
                  name="unitOfMeasure"
                  label="Unit of Measure"
                  options={uqcOptions}
                />
                <FormInput
                  control={control}
                  name="uomIssConvFactor"
                  label="Conv. Factor (UOM/Iss.UOM)"
                  placeholder="1.00000"
                  inputProps={{ type: "number", step: "0.00001" }}
                />
                <FormSelect
                  control={control}
                  name="issuingUnit"
                  label="Issuing Unit"
                  options={uqcOptions}
                />
                <FormInput
                  control={control}
                  name="uomUqcConvFactor"
                  label="Conv. Factor (UOM/UQC)"
                  placeholder="1.00000"
                  inputProps={{ type: "number", step: "0.00001" }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  control={control}
                  name="drawingRef"
                  label="Drawing/Ref."
                  placeholder="Enter drawing reference"
                />
                <FormInput
                  control={control}
                  name="stdAssayStrength"
                  label="Std. Assay/Strength"
                  placeholder="0.00"
                  inputProps={{ type: "number", step: "0.01" }}
                />
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
                <FormInput
                  control={control}
                  name="stdRate"
                  label="Std. Rate"
                  placeholder="0.00000"
                  inputProps={{ type: "number", step: "0.00001" }}
                />
                <FormInput
                  control={control}
                  name="leadTimeDays"
                  label="Lead Time (Days)"
                  placeholder="0.000"
                  inputProps={{ type: "number", step: "0.001" }}
                />
                <FormInput
                  control={control}
                  name="stdLossOnDry"
                  label="Std Loss on Dry"
                  placeholder="0.00"
                  inputProps={{ type: "number", step: "0.01" }}
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

          {/* Quality Control Switches */}
          <Card>
            <CardContent className="space-y-2 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormSwitch control={control} name="batchNotApplicable" label="Batch Not Applicable (NA)" />
                <FormSwitch control={control} name="qcRequired" label="Q.C. Required" />
                <FormSwitch control={control} name="allergen" label="Allergen" />
                <FormSwitch control={control} name="mfgDateApplicable" label="Mfg. Date Applicable" />
                <FormSwitch control={control} name="expiryDateApplicable" label="Expiry Date Applicable" />
                <FormSwitch control={control} name="trackSerialNos" label="Track Serial Nos." />
                <FormSwitch control={control} name="packingFreightInsuranceServices" label="Packing, Freight and Insurance Services" />
                <FormSwitch control={control} name="activeIngredient" label="Active Ingredient" />
                <FormSwitch control={control} name="mfgLocNameRequired" label="Mfg. Loc/Name Required" />
                <FormSwitch control={control} name="mfgMmYyyyApplicable" label="Mfg. MMYY Applicable" />
                <FormSwitch control={control} name="expiryMmYyyyApplicable" label="Expiry MMYY Applicable" />
                <FormSwitch control={control} name="principalForStatutoryReporting" label="Principal Item for Statutory Reporting" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Procurement Details */}
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-3 gap-4">
                <FormSwitch control={control} name="boughtOut" label="Bought-Out" />
                <FormSwitch control={control} name="jobWork" label="Job Work" />
                <FormSwitch control={control} name="imported" label="Imported" />
              </div>
              <FormInput
                control={control}
                name="currentBuyer"
                label="Current Buyer"
                placeholder="Enter current buyer"
              />
              <FormInput
                control={control}
                name="economicOrderQty"
                label="Economic Ord. Qty."
                placeholder="0"
                inputProps={{ type: "number" }}
              />
              <FormInput
                control={control}
                name="desiredPackSize"
                label="Desired Pack Size"
                placeholder="0"
                inputProps={{ type: "number" }}
              />
              <FormSwitch control={control} name="taxCreditApplicable" label="Tax Credit Applicable" />
              <FormInput
                control={control}
                name="freightOn"
                label="Freight On"
                placeholder="Weight/Volume"
              />
            </CardContent>
          </Card>

          {/* Manufacturing Details */}
          <Card>
            <CardContent className="space-y-4 pt-4">
              <FormSwitch control={control} name="manufactured" label="Manufactured" />
              <FormInput
                control={control}
                name="allowedAllergenPercent"
                label="Allowed Allergen %"
                placeholder="0.00"
                inputProps={{ type: "number", step: "0.01" }}
              />
              <FormInput
                control={control}
                name="stdMfgFeesPerUnit"
                label="Std. Mfg. Fees/Unit"
                placeholder="0.00000"
                inputProps={{ type: "number", step: "0.00001" }}
              />
              <FormInput
                control={control}
                name="mainProdCentre"
                label="Main Prod. Centre"
                placeholder="Enter main production centre"
              />
            </CardContent>
          </Card>

          {/* Sales Details */}
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-3 gap-4">
                <FormSwitch control={control} name="sold" label="Sold" />
                <FormSwitch control={control} name="keyProduct" label="Key Product" />
                <FormSwitch control={control} name="exported" label="Exported" />
              </div>
              <FormInput
                control={control}
                name="productType"
                label="Product Type"
                placeholder="Enter product type"
              />
              <FormInput
                control={control}
                name="productGroup"
                label="Product Group"
                placeholder="Enter product group"
              />
              <FormInput
                control={control}
                name="salesDivision"
                label="Sales Division"
                placeholder="Enter sales division"
              />
              <FormInput
                control={control}
                name="conversionFactor"
                label="Conversion Factor"
                placeholder="1.0"
                inputProps={{ type: "number", step: "0.1" }}
              />
              <FormInput
                control={control}
                name="vendorPartNo"
                label="Vendor's Part No."
                placeholder="Enter vendor part number"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Additional Details */}
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <p className="text-sm font-medium">Other Details</p>
              <p className="text-xs text-muted-foreground">
                Additional item information will be displayed here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

