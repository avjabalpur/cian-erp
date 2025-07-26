"use client"

import type React from "react"
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
import { Menu, Bell, LogOut, User, Settings, ChevronLeft, ChevronRight } from "lucide-react"

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
  const getInitials = () => {
    return `${user.username?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase()
  }

  return (
    <header className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
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
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">{/* Search bar can go here */}</div>
        <div className="ml-4 flex items-center md:ml-6">
          <Button variant="ghost" className="p-1 rounded-full text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
          </Button>

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
