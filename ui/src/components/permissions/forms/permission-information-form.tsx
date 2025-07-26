import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormMultiSelect } from "@/components/shared/forms/form-multiselect"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormTextarea } from "@/components/shared/forms/form-textarea"
import { FormSelect } from "@/components/shared/forms/form-select"

interface PermissionInformationFormProps {
  control: any;
}

export function PermissionInformationForm({ control }: PermissionInformationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Information</CardTitle>
        <CardDescription>Enter the details for this permission</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            control={control}
            name="name"
            label="Permission Name"
            placeholder="Enter permission name"
            inputProps={{
              type: "text",
              autoComplete: "off"
            }}
            required
          />

          <FormSelect
            control={control}
            name="moduleName"
            label="Module Name"
            options={[
              { label: "Administrator", value: "Administrator" },
              { label: "Sales", value: "Sales" },
              { label: "PurchaseOrder", value: "PurchaseOrder" },
              { label: "SalesOrderApproval", value: "SalesOrderApproval" },
              { label: "Inventory", value: "Inventory" },
              { label: "Accounts", value: "Accounts" },
              { label: "Quality", value: "Quality" },
              { label: "Dashboard", value: "Dashboard" },
              { label: "Reports", value: "Reports" },
            ]}
            placeholder="Select module"
            required
          />
          <FormMultiSelect
            control={control}
            name="actionType"
            label="Action Type"
            options={[
              { label: "Full Control", value: "FullControl" },
              { label: "Read", value: "Read" },
              { label: "Write", value: "Write" },
              { label: "Read & Write", value: "ReadWrite" },
              { label: "Delete", value: "Delete" },
              { label: "Approve", value: "Approve" },
              { label: "Export", value: "Export" },
              { label: "Import", value: "Import" },
            ]}
            placeholder="Select one or more actions"
          />

          <FormTextarea
            control={control}
            name="description"
            label="Description"
            placeholder="Enter permission description (optional)"
            textareaProps={{
              rows: 3
            }}
          />

          <div className="flex items-center space-x-2">
            <FormSwitch
              control={control}
              name="isActive"
              label="Active"
            />
            <div className="text-sm text-muted-foreground">
              Whether this permission is active and can be assigned to roles
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
