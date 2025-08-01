import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Building, UserIcon, Calendar, Clock, Edit } from "lucide-react"
import { getStatusColor, getInitials } from "./user-utils"
import { User } from "@/types/user"
import { formatDate } from "@/lib/date-utils"

interface UserInfoProps {
  user: User
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge variant={getStatusColor(user.isActive)}>{user.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              {user.username && <p className="text-muted-foreground">@{user.username}</p>}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.phone}</span>
            </div>
          )}

          {user.department && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.department}</span>
            </div>
          )}

          {user.designation && (
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.designation}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Joined: {formatDate(user.createdAt)}</span>
          </div>

          {user.createdAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Last login: {formatDate(user.createdAt)}</span>
            </div>
          )}
        </div>

        {/* {user.manager && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Reports to: <span className="font-medium text-foreground">{user.manager}</span>
            </p>
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}
