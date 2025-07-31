import { Button } from "@/components/ui/button"
import { RightDrawer } from "@/components/shared/right-drawer"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OrganizationInformationForm } from "./organization-information-form"
import { useCreateOrganization, useUpdateOrganization } from "@/hooks/use-organizations"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { organizationFormSchema, OrganizationFormValues } from "@/validations/organization"
import { UpdateOrganizationData } from "@/types/organization"

interface OrganizationDrawerProps {
  isOpen: boolean
  onClose: () => void
  organization?: any | null
}

export function OrganizationDrawer({ isOpen, onClose, organization }: OrganizationDrawerProps) {
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      code: organization?.code || '',
      name: organization?.name || '',
      locationTypeId: organization?.locationTypeId || 1,
      contactPerson: organization?.contactPerson || '',
      address1: organization?.address1 || '',
      address2: organization?.address2 || '',
      city: organization?.city || '',
      state: organization?.state || '',
      country: organization?.country || '',
      zip: organization?.zip || '',
      phone: organization?.phone || '',
      email: organization?.email || '',
      website: organization?.website || '',
      gstinNumber: organization?.gstinNumber || '',
      panNumber: organization?.panNumber || '',
      isActive: organization?.isActive ?? true,
    },
  })

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form
  const { mutate: createOrganization, isPending: isCreating } = useCreateOrganization()
  const { mutate: updateOrganization, isPending: isUpdating } = useUpdateOrganization()

  useEffect(() => {
    if (organization) {
      reset({
        code: organization.code || '',
        name: organization.name || '',
        locationTypeId: organization.locationTypeId || 1,
        contactPerson: organization.contactPerson || '',
        address1: organization.address1 || '',
        address2: organization.address2 || '',
        city: organization.city || '',
        state: organization.state || '',
        country: organization.country || '',
        zip: organization.zip || '',
        phone: organization.phone || '',
        email: organization.email || '',
        website: organization.website || '',
        gstinNumber: organization.gstinNumber || '',
        panNumber: organization.panNumber || '',
        isActive: organization.isActive ?? true,
      })
    } else {
      reset({
        code: '',
        name: '',
        locationTypeId: 1,
        contactPerson: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        phone: '',
        email: '',
        website: '',
        gstinNumber: '',
        panNumber: '',
        isActive: true,
      })
    }
  }, [organization, reset])

  const onSubmit = async (data: OrganizationFormValues) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      }
      if (organization) {
        await updateOrganization({ id: organization.id, data: payload as UpdateOrganizationData })
        toast({ title: 'Success', description: 'Organization updated successfully' })
      } else {
        await createOrganization(payload)
        toast({ title: 'Success', description: 'Organization created successfully' })
      }
      reset()
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={organization ? 'Edit Organization' : 'Create Organization'}
      description={organization ? 'Update organization details' : 'Add a new organization to the system'}
      size="2xl"
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <OrganizationInformationForm control={control} />
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isCreating || isUpdating}
            >
              {isCreating || isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  )
} 