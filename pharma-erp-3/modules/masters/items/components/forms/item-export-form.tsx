'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormTextArea } from "@/components/shared/forms/form-text-area"

interface ItemExportFormProps {
  control: any;
  itemId?: number;
}

export function ItemExportForm({ control, itemId }: ItemExportFormProps) {
  return (
    <div className="space-y-4">
      {/* Export Product Details */}
      <Card>
        <CardHeader>
          <CardTitle>Export Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextArea
            control={control}
            name="exportDetails.itemDescriptionForExports"
            label="Item Description for Exports"
            placeholder="Enter item description for exports"
            rows={3}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="exportDetails.exportProductGroupCode"
              label="Export Product Group Code"
              placeholder="Enter code"
            />
            <FormInput
              control={control}
              name="exportDetails.exportProductGroupName"
              label="Export Product Group Name"
              placeholder="Enter name"
            />
          </div>
        </CardContent>
      </Card>

      {/* DEPB Details */}
      <Card>
        <CardHeader>
          <CardTitle>DEPB Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            control={control}
            name="exportDetails.depbRateListSrlNo"
            label="DEPB Rate List Serial No."
            placeholder="Enter serial number"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="exportDetails.depbRate"
              label="DEPB Rate"
              placeholder="0.00"
            />
            <FormInput
              control={control}
              name="exportDetails.depbValueCap"
              label="DEPB Value Cap"
              placeholder="0.00"
            />
          </div>
          <FormTextArea
            control={control}
            name="exportDetails.depbRemarks"
            label="DEPB Remarks"
            placeholder="Enter remarks"
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Duty Drawback Details */}
      <Card>
        <CardHeader>
          <CardTitle>Duty Drawback Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            control={control}
            name="exportDetails.dutyDrawbackSrlNo"
            label="Duty Drawback Serial No."
            placeholder="Enter serial number"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="exportDetails.dutyDrawbackRate"
              label="Duty Drawback Rate"
              placeholder="0.00"
            />
            <FormInput
              control={control}
              name="exportDetails.dutyDrawbackRateType"
              label="Rate Type"
              placeholder="e.g., Percentage, Fixed"
            />
            <FormInput
              control={control}
              name="exportDetails.dutyDrawbackValueCap"
              label="Value Cap"
              placeholder="0.00"
            />
          </div>
          <FormTextArea
            control={control}
            name="exportDetails.dutyDrawbackRemarks"
            label="Duty Drawback Remarks"
            placeholder="Enter remarks"
            rows={2}
          />
        </CardContent>
      </Card>
    </div>
  )
}

