"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormTextArea } from "@/components/shared/forms/form-text-area"
interface RoleInformationFormProps {
  control: any;
}

export function RoleInformationForm({ control }: RoleInformationFormProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Information</CardTitle>
        <CardDescription>Enter the details for this role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            control={control}
            name="name"
            label="Role Name"
            placeholder="Enter role name"
            inputProps={{
              type: "text",
              autoComplete: "off"
            }}
            required
          />

          <FormTextArea
            control={control}
            name="description"
            label="Description"
            placeholder="Enter role description (optional)"
            rows={3}
          />

          <div className="flex items-center space-x-2">
            <FormSwitch
              control={control}
              name="isActive"
              label="Active"
            />
            <div className="text-sm text-muted-foreground">
              Whether this role is active and can be assigned to users
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
