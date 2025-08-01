"use client"

import { Button } from "@/components/ui/button"
import { RightDrawer } from "@/components/shared/right-drawer"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DosageInformationForm } from "./dosage-information-form"
import { useCreateDosage, useUpdateDosage } from "@/hooks/use-dosages"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { dosageFormSchema, DosageFormValues } from "@/validations/dosage"

interface DosageDrawerProps {
  isOpen: boolean
  onClose: () => void
  dosage?: any | null
}

export function DosageDrawer({ isOpen, onClose, dosage }: DosageDrawerProps) {
  const form = useForm<DosageFormValues>({
    resolver: zodResolver(dosageFormSchema),
    defaultValues: {
      name: dosage?.name || '',
      registerDate: dosage?.registerDate || '',
      isActive: dosage?.isActive ?? true,
    },
  })

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form
  const { mutate: createDosage, isPending: isCreating } = useCreateDosage()
  const { mutate: updateDosage, isPending: isUpdating } = useUpdateDosage()

  useEffect(() => {
    if (dosage) {
      reset({
        name: dosage.name || '',
        registerDate: dosage.registerDate || '',
        isActive: dosage.isActive ?? true,
      })
    } else {
      reset({
        name: '',
        registerDate: '',
        isActive: true,
      })
    }
  }, [dosage, reset])

  const onSubmit = async (data: DosageFormValues) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      }
      if (dosage) {
        await updateDosage({ id: dosage.id, data: payload })
        toast({ title: 'Success', description: 'Dosage updated successfully' })
      } else {
        await createDosage(payload)
        toast({ title: 'Success', description: 'Dosage created successfully' })
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
      title={dosage ? 'Edit Dosage' : 'Create Dosage'}
      description={dosage ? 'Update dosage details' : 'Add a new dosage to the system'}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <DosageInformationForm control={control} />
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