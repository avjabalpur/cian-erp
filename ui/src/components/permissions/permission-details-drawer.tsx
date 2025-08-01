import { RightDrawer } from "@/components/shared/right-drawer"
import { usePermissionById } from "@/hooks/use-permissions"
import { PermissionInfo } from "./permission-info"
import { PermissionRoles } from "./permission-roles"

interface PermissionDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  permissionId?: number | null
}

export function PermissionDetailsDrawer({ isOpen, onClose, permissionId }: PermissionDetailsDrawerProps) {
  const { data: permission, isLoading, error } = usePermissionById(permissionId || 0)

  if (isLoading) {
    return <div>Loading permission....</div>
  }
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Error loading permission details</div>
        </div>
      </div>
    )
  }
  if (!permission) {
    return <div>Permission not found</div>
  }

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={permission.name}
      size="xl"
    >
     <div className="lg:col-span-2 space-y-6">
          <PermissionInfo permission={permission} />
        </div>
    </RightDrawer>
  )
} 