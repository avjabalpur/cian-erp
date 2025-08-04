import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { ConfigListSelect } from "@/components/shared/config-list-select"
import { useItemTypes, useParentTypes } from "@/hooks/items/use-item-types"
import { useProductGroups } from "@/hooks/use-product-groups"
import { useController } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { DivisionLookup } from "@/components/shared/lookups/division-lookup"

interface ItemBasicInfoFormProps {
  control: any;
}

export function ItemBasicInfoForm({ control }: ItemBasicInfoFormProps) {
  const [isDivisionLookupOpen, setIsDivisionLookupOpen] = useState(false);
  
  // Fetch item types and parent types
  const { data: itemTypes = { items: [] } } = useItemTypes();
  const { data: parentTypes = [] } = useParentTypes();

  // Create options for item types
  const itemTypeOptions = [
    { label: "Select item type", value: "-1" },
    ...itemTypes.items.map((itemType) => ({
      label: `${itemType.code} - ${itemType.name}`,
      value: itemType.id.toString(),
    })),
  ];

  // Create options for sub types (parent types)
  const subTypeOptions = [
    { label: "Select sub type", value: "-1" },
    ...parentTypes.map((parentType) => ({
      label: `${parentType.code} - ${parentType.name}`,
      value: parentType.id.toString(),
    })),
  ];

  const uqcOptions = [
    { label: "Select UQC", value: "-1" },
    { label: "KGS - Kilograms", value: "KGS" },
    { label: "NOS - Numbers", value: "NOS" },
    { label: "LTR - Liters", value: "LTR" },
    { label: "MTR - Meters", value: "MTR" },
  ];

  const productTypeOptions = [
    { label: "Select Product Type", value: "-1" },
    { label: "Sale Pack", value: "Sale Pack" },
    { label: "Bulk", value: "Bulk" },
    { label: "Sample", value: "Sample" },
  ];

  const salesDivisionOptions = [
    { label: "Select Sales Division", value: "-1" },
    { label: "TPT - THIRD PARTY", value: "TPT" },
    { label: "DIRECT", value: "DIRECT" },
  ];

  const handleDivisionSelect = (divisionId: number) => {
    control.setValue("salesDivision", divisionId.toString());
  };

  // Fetch product groups
  const { data: productGroups = [] } = useProductGroups();

  const productGroupOptions = [
    { label: "Select Product Group", value: "-1" },
    ...productGroups.map((productGroup) => ({
      label: `${productGroup.code} - ${productGroup.productGroupName}`,
      value: productGroup.id.toString(),
    })),
  ];

  return (
    <div className="space-y-2">

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
        <FormSelect
          control={control}
          name="itemTypeId"
          label="Item Type"
          options={itemTypeOptions}
          required
        />
        <FormSelect
          control={control}
          name="subType"
          label="Sub-Type"
          options={subTypeOptions}
        />

        <div className="">
          <label className="text-[12px] font-medium">GS Ind.</label>
          <ConfigListSelect
            listCode="gs_id"
            value={control._formValues?.gsInd}
            onChange={(value) => {
              control.setValue("gsInd", value);
            }}
            placeholder="Select GS Ind."
          />
        </div>
        <FormInput
          control={control}
          name="hsn"
          label="HSN"
          placeholder="Enter HSN code"
        />
        <div className="space-y-2">
          <span className="text-sm font-medium">UQC:</span> <span className="text-sm font-medium">KGS</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-2">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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

          <Card>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

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
                  name="stdRate"
                  label="Std. Rate"
                  placeholder="0.00000"
                  inputProps={{ type: "number", step: "0.00001" }}
                />
                <FormInput
                  control={control}
                  name="leadTimeDays"
                  label="Lead Time (in Days)"
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
                  name="shelfLifeDays"
                  label="Shelf Life (Days)"
                  placeholder="0"
                  inputProps={{ type: "number" }}
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


          <Card>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <FormSwitch
                  control={control}
                  name="batchNotApplicable"
                  label="Batch Not Applicable (NA)"
                />

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

                <FormSwitch
                  control={control}
                  name="trackSerialNos"
                  label="Track Serial Nos."
                />

                <FormSwitch
                  control={control}
                  name="packingFreightInsuranceServices"
                  label="Packing,Freight and Insurance Services"
                />

                <FormSwitch
                  control={control}
                  name="activeIngredient"
                  label="Active Ingredient"
                />

                <FormSwitch
                  control={control}
                  name="mfgLocNameRequired"
                  label="Mfg. Loc/Name Required"
                />

                <FormSwitch
                  control={control}
                  name="mfgMmYyyyApplicable"
                  label="Mfg. MMYY Applicable"
                />

                <FormSwitch
                  control={control}
                  name="expiryMmYyyyApplicable"
                  label="Expiry MMYY Applicable"
                />

                <FormSwitch
                  control={control}
                  name="principalForStatutoryReporting"
                  label="Principal Item for Statutory Reporting"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - General, Conversion, and Manufacturing Details */}
        <div className="space-y-4">
          <Card>

            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2">
                <FormSwitch
                  control={control}
                  name="boughtOut"
                  label="Bought-Out"
                />

                <FormSwitch
                  control={control}
                  name="jobWork"
                  label="Job Work"
                />

                <FormSwitch
                  control={control}
                  name="imported"
                  label="Imported"
                />
              </div>
              <FormInput
                control={control}
                name="currentBuyer"
                label="Current Buyer"
                placeholder="Enter current buyer"
              />

              <div className="flex items-end gap-2">
                <FormInput
                  control={control}
                  name="economicOrderQty"
                  label="Economic Ord. Qty."
                  placeholder="0"
                  inputProps={{ type: "number" }}
                  className="w-full"
                />
                <span className="text-[10px] font-medium">NOS</span>
              </div>
              <div className="flex items-end gap-2">
                <FormInput
                  control={control}
                  name="desiredPackSize"
                  label="Desired Pack Size"
                  placeholder="0"
                  inputProps={{ type: "number" }}
                  className="w-full"
                />
                <span className="text-[10px] font-medium">NOS</span>
              </div>

              <FormSwitch
                control={control}
                name="taxCreditApplicable"
                label="Tax Credit Applicable"
              />

              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium">Freight on</label>
                <RadioGroup defaultValue="weight" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weight" id="weight" />
                    <Label htmlFor="weight">Weight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="volume" id="volume" />
                    <Label htmlFor="volume">Volume</Label>
                  </div>
                </RadioGroup>
              </div>

            </CardContent>
          </Card>
          <Card>

            <CardContent className="space-y-2">

              <FormSwitch
                control={control}
                name="manufactured"
                label="Manufactured"
              />

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
          <Card>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              <FormSwitch
                control={control}
                name="sold"
                label="Sold"
              />

              <FormSwitch
                control={control}
                name="keyProduct"
                label="Key Product"
              />

              <FormSwitch
                control={control}
                name="exported"
                label="Exported"
              />
              </div>

              <FormSelect
                control={control}
                name="productType"
                label="Product Type"
                options={productTypeOptions}
              />
            <FormSelect
                control={control}
                name="productGroup"
                label="Product Group"
                options={productGroupOptions}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Sales Division</label>
                <div className="flex gap-2">
                  <FormSelect
                    control={control}
                    name="salesDivision"
                    label=""
                    options={salesDivisionOptions}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDivisionLookupOpen(true)}
                    className="px-3"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              

              <FormInput
                control={control}
                name="conversionFactor"
                label="Conversion Factor"
                placeholder="NOS/NOS"
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
      </div>

      <DivisionLookup
        isOpen={isDivisionLookupOpen}
        onClose={() => setIsDivisionLookupOpen(false)}
        onSelect={handleDivisionSelect}
        title="Select Sales Division"
      />
    </div>
  )
} 