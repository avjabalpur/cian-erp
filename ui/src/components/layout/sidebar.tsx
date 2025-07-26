"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2 } from "lucide-react"
import { NavItem } from "./nav-item"

interface NavigationItemDef {
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: { label: string; href: string }[]
}

interface SidebarProps {
  navigation: NavigationItemDef[]
  title: string
  isCollapsed: boolean
}

export const Sidebar = ({ navigation, title, isCollapsed }: SidebarProps) => {
  return (
    <div
      className={cn(
        "hidden md:flex md:flex-col transition-all duration-300 border-r bg-white",
        isCollapsed ? "md:w-20" : "md:w-64",
      )}
    >
      <div className="flex items-center flex-shrink-0 px-4 h-16">
        <Building2 className="h-8 w-8 text-blue-600" />
        {!isCollapsed && <span className="ml-2 text-xl font-semibold text-gray-900 whitespace-nowrap">{title}</span>}
      </div>
      <ScrollArea className="flex-1 px-2 mt-5">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.label} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
