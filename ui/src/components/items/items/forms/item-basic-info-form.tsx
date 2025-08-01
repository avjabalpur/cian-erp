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
              name="itemTypeId"
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
              name="revNo"
              label="Revision No"
              placeholder="Enter revision number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="pharmacopoeiaName"
              label="Pharmacopoeia Name"
              placeholder="Enter pharmacopoeia name"
            />
            <FormInput
              control={control}
              name="drawingRef"
              label="Drawing Reference"
              placeholder="Enter drawing reference"
            />
          </div>
        </CardContent>
      </Card>

      {/* Unit of Measure */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Unit of Measure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormSelect
              control={control}
              name="unitOfMeasure"
              label="Unit of Measure"
              options={uqcOptions}
            />
            <FormSelect
              control={control}
              name="issuingUnit"
              label="Issuing Unit"
              options={uqcOptions}
            />
            <FormSwitch
              control={control}
              name="goodsType"
              label="Goods Type"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="uomIssConvFactor"
              label="UOM ISS Conversion Factor"
              placeholder="Enter conversion factor"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="uomUqcConvFactor"
              label="UOM UQC Conversion Factor"
              placeholder="Enter conversion factor"
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Planning Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Planning Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="leadTimeDays"
              label="Lead Time (Days)"
              placeholder="Enter lead time"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="economicOrderQty"
              label="Economic Order Qty"
              placeholder="Enter economic order quantity"
              inputProps={{ type: "number" }}
            />
            <FormInput
              control={control}
              name="desiredPackSize"
              label="Desired Pack Size"
              placeholder="Enter desired pack size"
              inputProps={{ type: "number" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="currentBuyer"
              label="Current Buyer"
              placeholder="Enter current buyer"
            />
            <FormInput
              control={control}
              name="freightOn"
              label="Freight On"
              placeholder="Enter freight on"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 