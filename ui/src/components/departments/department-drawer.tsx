import { Button } from "@/components/ui/button"
import { RightDrawer } from "@/components/shared/right-drawer"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DepartmentInformationForm } from "./department-information-form"
import { useCreateDepartment, useUpdateDepartment } from "@/hooks/use-departments"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { z } from "zod"
import { departmentFormSchema, DepartmentFormValues } from "@/validations/department"



interface DepartmentDrawerProps {
  isOpen: boolean
  onClose: () => void
  department?: any | null
}

export function DepartmentDrawer({ isOpen, onClose, department }: DepartmentDrawerProps) {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      code: department?.code || '',
      name: department?.name || '',
      description: department?.description || '',
      uomForMis: department?.uomForMis || '',
      isActive: department?.isActive ?? true,
    },
  })

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form
  const { mutate: createDepartment, isPending: isCreating } = useCreateDepartment()
  const { mutate: updateDepartment, isPending: isUpdating } = useUpdateDepartment()

  useEffect(() => {
    if (department) {
      reset({
        code: department.code || '',
        name: department.name || '',
        description: department.description || '',
        uomForMis: department.uomForMis || '',
        isActive: department.isActive ?? true,
      })
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        uomForMis: '',
        isActive: true,
      })
    }
  }, [department, reset])

  const onSubmit = async (data: DepartmentFormValues) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      }
      if (department) {
        await updateDepartment({ id: department.id, data: payload })
        toast({ title: 'Success', description: 'Department updated successfully' })
      } else {
        await createDepartment(payload)
        toast({ title: 'Success', description: 'Department created successfully' })
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
      title={department ? 'Edit Department' : 'Create Department'}
      description={department ? 'Update department details' : 'Add a new department to the system'}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <DepartmentInformationForm control={control} />
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