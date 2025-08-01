"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Bell, LogOut, User, Settings, ChevronLeft, ChevronRight, Home, ChevronRight as ChevronRightIcon } from "lucide-react"
import { ConfigurationMenu } from "@/components/shared/configuration-menu"

interface UserData {
  username: string
  email: string
  firstName: string
  lastName: string
}

interface HeaderProps {
  user: UserData
  onLogout: () => void
  onToggleSidebar: () => void
  isCollapsed: boolean
  setSidebarOpen: (open: boolean) => void
}

export const Header = ({ user, onLogout, onToggleSidebar, isCollapsed, setSidebarOpen }: HeaderProps) => {
  const pathname = usePathname()
  
  const getInitials = () => {
    return `${user.username?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase()
  }

  const generateBreadcrumbs = () => {
    if (pathname === '/dashboard') {
      return (
        <nav className="flex items-center space-x-1 text-sm text-gray-500">
          <span className="text-gray-900 font-medium">Dashboard</span>
        </nav>
      )
    }

    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return null

    return (
      <nav className="flex items-center space-x-1 text-sm text-gray-500">
        <Button variant="ghost" size="sm" className="h-auto p-1 hover:bg-gray-100">
          <Home className="h-4 w-4" />
        </Button>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const displayName = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          
          return (
            <React.Fragment key={segment}>
              <ChevronRightIcon className="h-4 w-4 text-gray-300" />
              <span className={isLast ? "text-gray-900 font-medium" : "text-gray-500"}>
                {displayName}
              </span>
            </React.Fragment>
          )
        })}
      </nav>
    )
  }

  return (
    <header className="relative z-10 flex-shrink-0 flex py-1 bg-white shadow">
      <Button
        variant="ghost"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        className="hidden md:inline-flex px-4 border-r border-gray-200 text-gray-500 focus:outline-none"
        onClick={onToggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
      </Button>
      
      <div className="flex-1 flex justify-between items-center">
        <div className="flex-1 flex items-center px-4">
          {generateBreadcrumbs()}
        </div>
        <div className="flex items-center px-4">
          <Button variant="ghost" className="p-1 rounded-full text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
          </Button>

          {/* Configuration Menu */}
          <ConfigurationMenu />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-3 flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}`} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex md:flex-col md:items-start md:ml-2">
                  <span className="text-sm font-medium text-gray-700">{`${user.firstName} ${user.lastName}`}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
