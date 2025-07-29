import { Button } from "@/components/ui/button"
import { RightDrawer } from "@/components/shared/right-drawer"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateUser, useUpdateUser } from "@/hooks/use-users"
import { toast } from "@/hooks/use-toast"
import { userFormSchema, UserFormValues } from "@/validations/user"
import { useEffect } from "react"
import { UserInformationForm } from "./forms/user-information-form"

interface UserDrawerProps {
  isOpen: boolean
  onClose: () => void
  user?: any | null
}

export function UserDrawer({ isOpen, onClose, user }: UserDrawerProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
        username: user?.username || '',
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        isActive: user?.isActive || true,
        department: user?.department || '',
        designation: user?.designation || '',
        password: user?.password || '',
        isEmailVerified: user?.isEmailVerified || false,
        isPhoneVerified: user?.isPhoneVerified || false,
    },
  })

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form
  const { mutate: createUser, isPending: isCreating } = useCreateUser()
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        employeeId: user.employeeId || '',
        department: user.department || '',
        isActive: user.isActive ?? true,
      })
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        employeeId: '',
        department: '',
        isActive: true,
      })
    }
  }, [user, reset])

  const onSubmit = async (data: UserFormValues) => {
    try {
      const payload = {
        username: data.username || data.email.split('@')[0],
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        department: data.department,
        designation: data.designation,
        employeeId: data.employeeId,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        reportingManagerId: data.reportingManagerId,
        isActive: data.isActive ?? true,
        isEmailVerified: data.isEmailVerified ?? false,
        isPhoneVerified: data.isPhoneVerified ?? false,
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        avatar: '',
        status: '',
        password: data.password,
      }
      if (user) {
        await updateUser({ id: user.id, data: payload })
        toast({ title: 'Success', description: 'User updated successfully' })
      } else {
        await createUser(payload as any)
        toast({ title: 'Success', description: 'User created successfully' })
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
      title={user ? 'Edit User' : 'Create User'}
      description={user ? 'Update user details' : 'Add a new user to the system'}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <UserInformationForm control={control as any} />
          <div className="flex justify-end gap-4">
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