import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormTextarea } from "@/components/shared/forms/form-textarea"
import { FormRadioGroup } from "@/components/shared/forms/form-radio-group"

interface ItemExportFormProps {
  control: any;
}

export function ItemExportForm({ control }: ItemExportFormProps) {
  const exportProductGroupOptions = [
    { label: "Select group", value: "" },
    { label: "GENERAL", value: "01" },
    { label: "SPECIAL", value: "02" },
  ];

  return (
    <div className="space-y-4">
      {/* Item's Description */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Item's Description (for Exports)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormTextarea
            control={control}
            name="itemDescriptionForExports"
            label="Description"
            placeholder="Enter detailed description for exports"
            rows={4}
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
            <FormSelect
              control={control}
              name="exportProductGroupCode"
              label="Group Code"
              options={exportProductGroupOptions}
            />
            <FormInput
              control={control}
              name="exportProductGroupName"
              label="Group Name"
              placeholder="GENERAL"
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {/* D.E.P.B. Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">D.E.P.B. Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="depbRateListSrlNo"
              label="Rate List Srl. No."
              placeholder="Enter serial number"
            />
            <FormInput
              control={control}
              name="depbRate"
              label="Rate"
              placeholder="0.0000 %"
              inputProps={{ type: "number", step: "0.0001" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="depbValueCap"
              label="Value Cap"
              placeholder="0.00 Per Unit"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormTextarea
              control={control}
              name="depbRemarks"
              label="Remarks"
              placeholder="Enter DEPB remarks"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Duty Drawback Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Duty Drawback Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="dutyDrawbackSrlNo"
            label="Srl. No."
            placeholder="Enter serial number"
          />

          <div className="space-y-3">
            <FormRadioGroup
              control={control}
              name="dutyDrawbackRateType"
              label="Rate"
              options={[
                { value: "percent", label: "% of F.O.B. Value" },
                { value: "fixed", label: "Fixed Amount Per Unit" },
              ]}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormInput
                control={control}
                name="dutyDrawbackRatePercent"
                label="Rate %"
                placeholder="0.0000 %"
                inputProps={{ type: "number", step: "0.0001" }}
              />
              <FormInput
                control={control}
                name="dutyDrawbackRateFixed"
                label="Fixed Amount"
                placeholder="0.00"
                inputProps={{ type: "number", step: "0.01" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="dutyDrawbackValueCap"
              label="Value Cap"
              placeholder="0.00 Per Unit"
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormTextarea
              control={control}
              name="dutyDrawbackRemarks"
              label="Remarks"
              placeholder="Enter duty drawback remarks"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
