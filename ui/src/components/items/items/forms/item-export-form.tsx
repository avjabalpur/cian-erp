import { useEffect } from "react";
import { useController } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormTextarea } from "@/components/shared/forms/form-textarea"
import { FormSelect } from "@/components/shared/forms/form-select"
import { useItemExportDetails } from "@/hooks/items/use-item-export-details"

interface ItemExportFormProps {
  control: any;
  itemId?: number;
}

export function ItemExportForm({ control, itemId }: ItemExportFormProps) {
  // Fetch item export details data
  const { data: exportData, isLoading } = useItemExportDetails(itemId || 0);
  
  // Use controller to programmatically set form values
  const { field: itemDescriptionField } = useController({
    name: "itemDescriptionForExports",
    control,
  });

  const { field: exportProductGroupCodeField } = useController({
    name: "exportProductGroupCode",
    control,
  });

  const { field: exportProductGroupNameField } = useController({
    name: "exportProductGroupName",
    control,
  });

  const { field: depbRateListSrlNoField } = useController({
    name: "depbRateListSrlNo",
    control,
  });

  const { field: depbRateField } = useController({
    name: "depbRate",
    control,
  });

  const { field: depbValueCapField } = useController({
    name: "depbValueCap",
    control,
  });

  const { field: depbRemarksField } = useController({
    name: "depbRemarks",
    control,
  });

  const { field: dutyDrawbackSrlNoField } = useController({
    name: "dutyDrawbackSrlNo",
    control,
  });

  const { field: dutyDrawbackRateTypeField } = useController({
    name: "dutyDrawbackRateType",
    control,
  });

  const { field: dutyDrawbackRatePercentField } = useController({
    name: "dutyDrawbackRatePercent",
    control,
  });

  const { field: dutyDrawbackRateFixedField } = useController({
    name: "dutyDrawbackRateFixed",
    control,
  });

  const { field: dutyDrawbackValueCapField } = useController({
    name: "dutyDrawbackValueCap",
    control,
  });

  const { field: dutyDrawbackRemarksField } = useController({
    name: "dutyDrawbackRemarks",
    control,
  });

  // Populate form when export data is loaded
  useEffect(() => {
    if (exportData && itemId) {
      itemDescriptionField.onChange(exportData.itemDescriptionForExports || "");
      exportProductGroupCodeField.onChange(exportData.exportProductGroupCode || "");
      exportProductGroupNameField.onChange(exportData.exportProductGroupName || "");
      depbRateListSrlNoField.onChange(exportData.depbRateListSrlNo || "");
      depbRateField.onChange(exportData.depbRate?.toString() || "");
      depbValueCapField.onChange(exportData.depbValueCap?.toString() || "");
      depbRemarksField.onChange(exportData.depbRemarks || "");
      dutyDrawbackSrlNoField.onChange(exportData.dutyDrawbackSrlNo || "");
      dutyDrawbackRateTypeField.onChange(exportData.dutyDrawbackRateType || "");
      dutyDrawbackRatePercentField.onChange(exportData.dutyDrawbackRatePercent?.toString() || "");
      dutyDrawbackRateFixedField.onChange(exportData.dutyDrawbackRateFixed?.toString() || "");
      dutyDrawbackValueCapField.onChange(exportData.dutyDrawbackValueCap?.toString() || "");
      dutyDrawbackRemarksField.onChange(exportData.dutyDrawbackRemarks || "");
    }
  }, [exportData, itemId, itemDescriptionField, exportProductGroupCodeField, exportProductGroupNameField, depbRateListSrlNoField, depbRateField, depbValueCapField, depbRemarksField, dutyDrawbackSrlNoField, dutyDrawbackRateTypeField, dutyDrawbackRatePercentField, dutyDrawbackRateFixedField, dutyDrawbackValueCapField, dutyDrawbackRemarksField]);

  if (isLoading && itemId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-500">Loading export details...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Item Description for Exports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Item Description for Exports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormTextarea
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
