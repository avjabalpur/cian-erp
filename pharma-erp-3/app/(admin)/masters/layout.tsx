"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Building2, 
  Layers, 
  MapPin, 
  Building, 
  Pill, 
  Package, 
  ShoppingCart, 
  Users, 
  UserCheck, 
  Warehouse,
  FolderTree
} from "lucide-react"

const masterTabs = [
  { label: "Departments", href: "/masters/departments", icon: Building2 },
  { label: "Divisions", href: "/masters/divisions", icon: Layers },
  { label: "Location Types", href: "/masters/location-types", icon: MapPin },
  { label: "Organizations", href: "/masters/organizations", icon: Building },
  { label: "Dosages", href: "/masters/dosages", icon: Pill },
  { label: "HSNMaster", href: "/masters/hsn", icon: FolderTree },
  { label: "Items", href: "/masters/items", icon: Package },
 
  { label: "Customers", href: "/masters/customers", icon: Users },
  { label: "Vendors", href: "/masters/vendors", icon: UserCheck },
  { label: "Warehouses", href: "/masters/warehouses", icon: Warehouse },
]

export default function MastersLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      <div className="px-4 py-2">
        <div className="w-full">
          {/* Header with tabs */}
          <div className="grid w-full grid-cols-10 gap-2 mb-2">
            {masterTabs.map((tab) => {
              const isActive = pathname === tab.href
              const Icon = tab.icon
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Link>
              )
            })}
          </div>

          {/* Page content */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

