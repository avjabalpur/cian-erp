import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Calendar, Clock, Shield } from "lucide-react"
import { Permission } from "@/types/permission"
import { formatDate } from "@/lib/date-utils"

interface PermissionInfoProps {
  permission: Permission
  onEdit?: () => void
}

export function PermissionInfo({ permission, onEdit }: PermissionInfoProps) {
  const actionTypes = permission.actionType ? permission.actionType.split(',') : []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">
                  {permission.name}
                </h1>
                <Badge variant={permission.isActive ? "default" : "secondary"}>
                  {permission.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        
          <div className="flex items-center gap-2">
            <span className="font-medium">Description:</span>
            <span className="text-sm">{permission.description || '-'}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Module:</span>
            <Badge variant="outline">{permission.moduleName}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Created: {formatDate(permission.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Actions:</span>
            <div className="flex flex-wrap gap-1">
              {actionTypes.map((action, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 