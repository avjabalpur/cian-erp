import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, LogOut, User, Shield, Database, Users, UserCog, ShieldCheck } from "lucide-react"

export default function ERPHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Company Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-sans">PharmaERP</h1>
              <p className="text-xs text-gray-500 font-sans">Manufacturing Excellence</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
            Production Environment
          </Badge>
        </div>

        {/* Right Side - Notifications and User Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Administrator Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <UserCog className="w-4 h-4" />
                <span className="text-sm">Administrator</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/administrator/users" className="flex items-center gap-2 cursor-pointer">
                  <Users className="w-4 h-4" />
                  Users
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/administrator/roles" className="flex items-center gap-2 cursor-pointer">
                  <ShieldCheck className="w-4 h-4" />
                  Roles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/administrator/permissions" className="flex items-center gap-2 cursor-pointer">
                  <Shield className="w-4 h-4" />
                  Permissions
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* System Status */}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-md">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-700 font-medium">System Online</span>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 h-auto">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-medium">JD</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Production Manager</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">john.doe@pharmaerp.com</p>
                <p className="text-xs text-gray-500">Plant: Mumbai Manufacturing</p>
              </div>
              <DropdownMenuItem className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Database className="w-4 h-4" />
                System Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600">
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
