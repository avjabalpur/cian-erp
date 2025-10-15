"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ERPHeader from "@/components/erp-header"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Masters", href: "/masters" },
  { label: "Sales & Distribution", href: "/sales" },
  { label: "Procurement", href: "/procurement" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Inventory", href: "/inventory" },
  { label: "Quality Control", href: "/quality" },
  { label: "R&D & Clinical", href: "/rd-clinical" },
  { label: "Compliance", href: "/compliance" },
  { label: "Financial", href: "/financial" },
  { label: "Analytics", href: "/analytics" },
  { label: "Reports", href: "/reports" },
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <ERPHeader />

      <div className="border-b bg-white">
        <div className="px-6 py-4">
          <div className="grid grid-cols-12 gap-2 max-w-full">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href
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
                  {tab.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-0">
        {children}
      </div>
    </div>
  )
}
