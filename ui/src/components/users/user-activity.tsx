import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Monitor, Globe } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface UserActivitiesProps {
  activities: any[]
}

export function UserActivities({ activities }: UserActivitiesProps) {
  const getActivityIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case "login":
      case "logout":
        return <Monitor className="h-4 w-4 text-blue-500" />
      case "role_assigned":
      case "role_removed":
        return <Activity className="h-4 w-4 text-green-500" />
      default:
        return <Globe className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case "login":
        return "default"
      case "logout":
        return "secondary"
      case "role_assigned":
        return "default"
      case "role_removed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 pb-3 border-b last:border-b-0 last:pb-0">
              <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.activityType)}</div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={getActivityColor(activity.activityType)} className="text-xs">
                    {activity.activityType.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</span>
                </div>

                <p className="text-sm">{activity.description}</p>

                {activity.ipAddress && <div className="text-xs text-muted-foreground">IP: {activity.ipAddress}</div>}
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
