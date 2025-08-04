import { Button } from "@/components/ui/button"
import { RightDrawer } from "@/components/shared/right-drawer"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DivisionInformationForm } from "./division-information-form"
import { useCreateDivision, useUpdateDivision } from "@/hooks/use-divisions"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { divisionFormSchema, DivisionFormValues } from "@/validations/division"

interface DivisionDrawerProps {
  isOpen: boolean
  onClose: () => void
  division?: any | null
  departments: { id: number; name: string }[]
}

export function DivisionDrawer({ isOpen, onClose, division, departments }: DivisionDrawerProps) {
  const form = useForm<DivisionFormValues>({
    resolver: zodResolver(divisionFormSchema),
    defaultValues: {
      code: division?.code || '',
      name: division?.name || '',
      description: division?.description || '',
      departmentId: division?.departmentId ? division.departmentId : 0,
      unit: division?.unit || '',
      conversionFactor: division?.conversionFactor ?? 1.0,
      isActive: division?.isActive ?? true,
    },
  })

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form
  const { mutate: createDivision, isPending: isCreating } = useCreateDivision()
  const { mutate: updateDivision, isPending: isUpdating } = useUpdateDivision()

  useEffect(() => {
    if (division) {
      reset({
        code: division.code || '',
        name: division.name || '',
        description: division.description || '',
        departmentId: division.departmentId ? division.departmentId : 0,
        unit: division.unit || '',
        conversionFactor: division.conversionFactor ?? 1.0,
        isActive: division.isActive ?? true,
      })
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        departmentId: 0,
        unit: '',
        conversionFactor: 1.0,
        isActive: true,
      })
    }
  }, [division, reset])

  const onSubmit = async (data: DivisionFormValues) => {
    try {
      const payload = {
        ...data,
        departmentId: data.departmentId ? Number(data.departmentId) : undefined,
        isActive: data.isActive ?? true,
      }
      if (division) {
        await updateDivision({ id: division.id, data: payload })
        toast({ title: 'Success', description: 'Division updated successfully' })
      } else {
        await createDivision(payload)
        toast({ title: 'Success', description: 'Division created successfully' })
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
      title={division ? 'Edit Division' : 'Create Division'}
      description={division ? 'Update division details' : 'Add a new division to the system'}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <DivisionInformationForm control={control} departments={departments} />
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