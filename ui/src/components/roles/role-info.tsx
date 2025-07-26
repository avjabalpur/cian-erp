import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Calendar, Clock } from "lucide-react"
import { Role } from "@/types/role"
import { formatDate } from "@/lib/date-utils"

interface RoleInfoProps {
  role: Role
  onEdit?: () => void
}

export function RoleInfo({ role, onEdit }: RoleInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {role.name}
                </h1>
                <Badge variant={role.isActive ? "default" : "secondary"}>
                  {role.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Role
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Description:</span>
            <span className="text-sm">{role.description || '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Created: {formatDate(role.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
