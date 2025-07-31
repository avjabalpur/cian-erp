import { Button } from "@/components/ui/button"
import { RightDrawer } from "@/components/shared/right-drawer"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LocationTypeInformationForm } from "./location-type-information-form"
import { useCreateLocationType, useUpdateLocationType } from "@/hooks/use-location-types"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { locationTypeFormSchema, LocationTypeFormValues } from "@/validations/location-type"
import { UpdateLocationTypeData } from "@/types/location-type"

interface LocationTypeDrawerProps {
  isOpen: boolean
  onClose: () => void
  locationType?: any | null
}

export function LocationTypeDrawer({ isOpen, onClose, locationType }: LocationTypeDrawerProps) {
  const form = useForm<LocationTypeFormValues>({
    resolver: zodResolver(locationTypeFormSchema),
    defaultValues: {
      code: locationType?.code || '',
      name: locationType?.name || '',
      isActive: locationType?.isActive ?? true,
    },
  })

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form
  const { mutate: createLocationType, isPending: isCreating, error: createError } = useCreateLocationType()
  const { mutate: updateLocationType, isPending: isUpdating, error: updateError } = useUpdateLocationType()

  useEffect(() => {
    if (locationType) {
      reset({
        code: locationType.code || '',
        name: locationType.name || '',
        isActive: locationType.isActive ?? true,
      })
    } else {
      reset({
        code: '',
        name: '',
        isActive: true,
      })
    }
  }, [locationType, reset])

  useEffect(() => {
    if (createError) {
      toast({
        title: 'Error',
        description: createError.message || 'Failed to create location type',
        variant: 'destructive',
      })
    }
  }, [createError])

  useEffect(() => {
    if (updateError) {
      toast({
        title: 'Error',
        description: updateError.message || 'Failed to update location type',
        variant: 'destructive',
      })
    }
  }, [updateError])

  const onSubmit = async (data: LocationTypeFormValues) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      }
      
      if (locationType) {
        updateLocationType(
          { id: locationType.id, data: payload as UpdateLocationTypeData },
          {
            onSuccess: () => {
              toast({ title: 'Success', description: 'Location type updated successfully' })
              reset()
              onClose()
            },
            onError: (error) => {
              toast({
                title: 'Error',
                description: error.message || 'Failed to update location type',
                variant: 'destructive',
              })
            }
          }
        )
      } else {
        createLocationType(
          payload,
          {
            onSuccess: () => {
              toast({ title: 'Success', description: 'Location type created successfully' })
              reset()
              onClose()
            },
            onError: (error) => {
              toast({
                title: 'Error',
                description: error.message || 'Failed to create location type',
                variant: 'destructive',
              })
            }
          }
        )
      }
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
      title={locationType ? 'Edit Location Type' : 'Create Location Type'}
      description={locationType ? 'Update location type details' : 'Add a new location type to the system'}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <LocationTypeInformationForm control={control} />
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