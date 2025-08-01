import { Button } from "@/components/ui/button"
import { RightDrawer } from "@/components/shared/right-drawer"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateUser, useUpdateUser, useUserById } from "@/hooks/use-users"
import { toast } from "@/hooks/use-toast"
import { userFormSchema, UserFormValues } from "@/validations/user"
import { useEffect } from "react"
import { UserInformationForm } from "./user-information-form"
import { UserInfo } from "./user-info"
import { UserRoles } from "./user-roles"

interface UserDrawerProps {
  isOpen: boolean
  onClose: () => void
  userId?: number | null
}

export function UserDetailsDrawer({ isOpen, onClose, userId }: UserDrawerProps) {
  const { data: user, isLoading, error } = useUserById(userId?.toString() || '')

  if (isLoading) {
    return <div>Loading user....</div>
  }
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Error loading user details</div>
        </div>
      </div>
    )
  }
  if (!user) {
    return <div>User not found</div>
  }

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`User Details`}
      description={`User Details`}
      size="3xl"
    >
     <div className="lg:col-span-2 space-y-6">
          <UserInfo user={user} />
          <UserRoles userId={user.id.toString()} />
        </div>
    </RightDrawer>
  )
} 