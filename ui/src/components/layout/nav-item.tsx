"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface NavigationItemDef {
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: { label: string; href: string }[]
}

interface NavItemProps {
  item: NavigationItemDef
  isCollapsed: boolean
}

export const NavItem = ({ item, isCollapsed }: NavItemProps) => {
  const pathname = usePathname()
  const hasChildren = item.children && item.children.length > 0

  const [isOpen, setIsOpen] = useState(false)

  const isActive = hasChildren && item.children
    ? item.children.some(child => pathname === child.href)
    : pathname === item.href

  useEffect(() => {
    if (isActive) {
      setIsOpen(true)
    }
  }, [isActive])

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen)
    }
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={handleClick}
          className={cn(
            "group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none",
            isCollapsed ? "justify-center" : "justify-between",
            isActive ? "text-gray-900" : "text-gray-600"
          )}
          title={isCollapsed ? item.label : undefined}
        >
          <div className="flex items-center">
            <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>{item.label}</span>}
          </div>
          {!isCollapsed && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transform transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          )}
        </button>
        {!isCollapsed && isOpen && (
          <div className="pl-7 mt-1 space-y-1">
            {item.children?.map((child) => (
              <Link
                key={child.label}
                href={child.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full",
                  pathname === child.href
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
        isActive
          ? "bg-blue-100 text-blue-900"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        isCollapsed && "justify-center"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
      {!isCollapsed && item.label}
    </Link>
  )
}
