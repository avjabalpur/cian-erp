"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ERPHeader from "@/components/erp-header"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "Dashboard", href: "/dashboard", isImplemented: true },
  { label: "Masters", href: "/masters", isImplemented: true },
  { label: "Sales", href: "/sales", isImplemented: true },
  { label: "Procurement", href: "/procurement", isImplemented: false },
  { label: "Inventory", href: "/inventory", isImplemented: false },
  { label: "Quality Control", href: "/quality", isImplemented: false },
  { label: "R&D & Clinical", href: "/rd-clinical", isImplemented: false },
  { label: "Compliance", href: "/compliance", isImplemented: false },
  { label: "Financial", href: "/financial", isImplemented: false },
  { label: "Analytics", href: "/analytics", isImplemented: false },
  { label: "Reports", href: "/reports", isImplemented: false },
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
        <div className="px-6 py-2">
          <div className="grid grid-cols-12 gap-2 max-w-full">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    !tab.isImplemented && "opacity-60 line-through",
                    tab.isImplemented
                      ? isActive
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      : "text-muted-foreground cursor-not-allowed"
                  )}
                  onClick={(e) => {
                    if (!tab.isImplemented) {
                      e.preventDefault()
                    }
                  }}
                >
                  {tab.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-0 bg-secondary">
        {children}
      </div>
    </div>
  )
}
