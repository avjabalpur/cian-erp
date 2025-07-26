"use client"

import type React from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout basePath="/dashboard" title="CIAN ERP">
      {children}
    </DashboardLayout>
  )
}

