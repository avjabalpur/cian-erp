import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormTextarea } from "@/components/shared/forms/form-textarea"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { ConfigListSelect } from "@/components/shared/config-list-select"
import { useItemTypes, useParentTypes } from "@/hooks/items/use-item-types"
import { useController } from "react-hook-form"

interface ItemBasicInfoFormProps {
  control: any;
}

export function ItemBasicInfoForm({ control }: ItemBasicInfoFormProps) {
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

  return (
    <div className="space-y-4">
      {/* Item Identification */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Item Identification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormSelect
              control={control}
              name="itemType"
              label="Item Type"
              options={itemTypeOptions}
              required
            />
            <FormSelect
              control={control}
              name="subType"
              label="Sub Type"
              options={subTypeOptions}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">GS Ind.</label>
              <ConfigListSelect
                listCode="GS_IND"
                value={control._formValues?.gsInd}
                onChange={(value) => {
                  control.setValue("gsInd", value);
                }}
                placeholder="Select GS Ind."
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="itemCode"
              label="Item Code"
              placeholder="Enter item code"
              required
            />
            <FormInput
              control={control}
              name="itemName"
              label="Item Name"
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="shortName"
              label="Short Name"
              placeholder="Enter short name"
            />
            <FormInput
              control={control}
              name="pharmacopeiaName"
              label="Pharmacopeia Name"
              placeholder="Enter pharmacopeia name"
            />
          </div>
        </CardContent>
      </Card>

      {/* HSN & UQC Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">HSN & UQC Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="hsn"
              label="HSN"
              placeholder="Enter HSN code"
            />
            <FormSelect
              control={control}
              name="uqc"
              label="UQC"
              options={uqcOptions}
            />
            <FormInput
              control={control}
              name="unitOfMeasure"
              label="Unit of Measure"
              placeholder="Enter unit"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="issuingUnit"
              label="Issuing Unit"
              placeholder="Enter issuing unit"
            />
            <FormInput
              control={control}
              name="convFactorUomIss"
              label="Conv. Factor (UOM/Iss.UOM)"
              placeholder="1.00000"
              inputProps={{ type: "number", step: "0.00001" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Item Properties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Item Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormSwitch
              control={control}
              name="goods"
              label="Goods"
            />
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
        
            <FormSwitch
              control={control}
              name="manufactured"
              label="Manufactured"
            />
            <FormSwitch
              control={control}
              name="taxCreditApplicable"
              label="Tax Credit Applicable"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="currentBuyer"
              label="Current Buyer"
              placeholder="Enter current buyer"
            />
            <FormInput
              control={control}
              name="economicOrdQty"
              label="Economic Ord. Qty."
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          
            <FormInput
              control={control}
              name="desiredPackSize"
              label="Desired Pack Size"
              placeholder="Enter pack size"
            />
            <FormInput
              control={control}
              name="freightOn"
              label="Freight on"
              placeholder="100.00 %"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="drawingRef"
              label="Drawing/Ref."
              placeholder="Enter drawing reference"
            />
            <FormInput
              control={control}
              name="leadTime"
              label="Lead Time (in Days)"
              placeholder="Enter lead time"
              inputProps={{ type: "number" }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 