"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isFirst = index === 0
          const isLast = index === items.length - 1

          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="mx-1 h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
              )}

              {isFirst ? (
                <Link href={item.href} className="flex items-center hover:text-foreground transition-colors">
                  <Home className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only">{item.label}</span>
                </Link>
              ) : isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
