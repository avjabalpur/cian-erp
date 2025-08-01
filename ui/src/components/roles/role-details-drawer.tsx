import { RightDrawer } from "@/components/shared/right-drawer"
import { useRoleById } from "@/hooks/use-roles"
import { RoleInfo } from "./role-info"
import { RolePermission } from "./role-permission"

interface RoleDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  roleId?: number | null
}

export function RoleDetailsDrawer({ isOpen, onClose, roleId }: RoleDetailsDrawerProps) {
  const { data: role, isLoading, error } = useRoleById(roleId || 0)

  if (isLoading) {
    return <div>Loading role....</div>
  }
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Error loading role details</div>
        </div>
      </div>
    )
  }
  if (!role) {
    return <div>Role not found</div>
  }

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={role.name}
      size="3xl"
    >
     <div className="lg:col-span-2 space-y-6">
          <RoleInfo role={role} />
          <RolePermission roleId={role.id} />
        </div>
    </RightDrawer>
  )
} 