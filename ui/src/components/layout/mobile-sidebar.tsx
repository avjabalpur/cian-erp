"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2 } from "lucide-react"
import { NavItem } from "./nav-item"

interface NavigationItemDef {
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: { label: string; href: string }[]
}

interface MobileSidebarProps {
  navigation: NavigationItemDef[]
  title: string
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const MobileSidebar = ({ navigation, title, isOpen, setIsOpen }: MobileSidebarProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center flex-shrink-0 px-4 h-16 border-b">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">{title}</span>
          </div>
          <ScrollArea className="flex-1 px-2 mt-5">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.label} item={item} isCollapsed={false} />
              ))}
            </nav>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
