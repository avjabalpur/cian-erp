"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, ShieldCheck, Shield, UserCog } from "lucide-react"

const adminTabs = [
  { label: "Users", href: "/administrator/users", icon: Users },
  { label: "Roles", href: "/administrator/roles", icon: ShieldCheck },
  { label: "Permissions", href: "/administrator/permissions", icon: Shield },
]

export default function AdministratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        <div className="w-full">
          {/* Header with tabs */}
          <div className="grid w-full grid-cols-6 gap-2 max-w-4xl mb-6">
              {adminTabs.map((tab) => {
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

