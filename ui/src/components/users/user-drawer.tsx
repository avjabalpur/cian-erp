import { Button } from "@/components/ui/button"
import { RightDrawer } from "@/components/shared/right-drawer"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateUser, useUpdateUser } from "@/hooks/use-users"
import { toast } from "@/hooks/use-toast"
import { userFormSchema, createUserSchema, updateUserSchema, UserFormValues } from "@/validations/user"
import { useEffect } from "react"
import { UserInformationForm } from "./user-information-form"

interface UserDrawerProps {
  isOpen: boolean
  onClose: () => void
  user?: any | null
}

export function UserDrawer({ isOpen, onClose, user }: UserDrawerProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(user ? updateUserSchema : createUserSchema),
    defaultValues: {
        username: user?.username || '',
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        isActive: user?.isActive || true,
        department: user?.department || '',
        designation: user?.designation || '',
        password: user?.password || '', // Always start with empty password
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
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        employeeId: user.employeeId || '',
        department: user.department || '',
        designation: user.designation || '',
        isActive: user.isActive ?? true,
        password: '', // Don't populate password for edit
      })
    } else {
      reset({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        employeeId: '',
        department: '',
        designation: '',
        isActive: true,
        password: '', // Empty password for new user
      })
    }
  }, [user, reset])

  const onSubmit = async (data: UserFormValues) => {
    try {
      const payload = {
        id: user?.id,
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
        ...(data.password && { password: data.password }), // Only include password if provided
      }
      
      if (user) {
        updateUser(
          { id: user.id.toString(), data: payload },
          {
            onSuccess: () => {
              toast({ title: 'Success', description: 'User updated successfully' })
              reset()
              onClose()
            },
            onError: (error) => {
              toast({
                title: 'Error',
                description: 'Failed to update user. Please try again.',
                variant: 'destructive',
              })
            }
          }
        )
      } else {
        createUser(
          payload as any,
          {
            onSuccess: () => {
              toast({ title: 'Success', description: 'User created successfully' })
              reset()
              onClose()
            },
            onError: (error) => {
              toast({
                title: 'Error',
                description: 'Failed to create user. Please try again.',
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
  console.log(form.formState.errors);

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={user ? 'Edit User' : 'Create User'}
      description={user ? 'Update user details' : 'Add a new user to the system'}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <UserInformationForm control={control} />
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