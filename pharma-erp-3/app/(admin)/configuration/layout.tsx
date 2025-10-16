"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { List, Sliders } from "lucide-react"

const configTabs = [
  { label: "Config Lists", href: "/configuration/config-lists", icon: List },
  { label: "Config Settings", href: "/configuration/config-settings", icon: Sliders },
]

export default function ConfigurationLayout({
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
          <div className="flex gap-2 mb-2">
            {configTabs.map((tab) => {
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
          <div className="bg-background pt-2 rounded-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

