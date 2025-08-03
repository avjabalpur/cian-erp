import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormTextArea } from "@/components/shared/forms/form-text-area"

interface ItemExportFormProps {
  control: any;
  itemId?: number;
}

export function ItemExportForm({ control, itemId }: ItemExportFormProps) {

  return (
    <div className="space-y-4">
      {/* Item Description for Exports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Item Description for Exports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormTextArea
            control={control}
            name="itemDescriptionForExports"
            label="Description"
            placeholder="Enter item description for exports..."
          />
        </CardContent>
      </Card>

      {/* Export Product Group */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Export Product Group</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="exportProductGroupCode"
              label="Product Group Code"
              placeholder="Enter product group code"
            />
            <FormInput
              control={control}
              name="exportProductGroupName"
              label="Product Group Name"
              placeholder="Enter product group name"
            />
          </div>
        </CardContent>
      </Card>

      {/* DEPB Rate Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">DEPB Rate Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="depbRateListSrlNo"
              label="Rate List Serial No."
              placeholder="Enter serial number"
            />
            <FormInput
              control={control}
              name="depbRate"
              label="DEPB Rate"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="depbValueCap"
              label="Value Cap"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>
          <FormTextarea
            control={control}
            name="depbRemarks"
            label="DEPB Remarks"
            placeholder="Enter DEPB remarks..."
          />
        </CardContent>
      </Card>

      {/* Duty Drawback Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Duty Drawback Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="dutyDrawbackSrlNo"
              label="Serial No."
              placeholder="Enter serial number"
            />
            <FormInput
              control={control}
              name="dutyDrawbackRateType"
              label="Rate Type"
              placeholder="Enter rate type"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              control={control}
              name="dutyDrawbackRatePercent"
              label="Rate Percent"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="dutyDrawbackRateFixed"
              label="Rate Fixed"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              control={control}
              name="dutyDrawbackValueCap"
              label="Value Cap"
              placeholder="0.00"
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>
          <FormTextarea
            control={control}
            name="dutyDrawbackRemarks"
            label="Duty Drawback Remarks"
            placeholder="Enter duty drawback remarks..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
