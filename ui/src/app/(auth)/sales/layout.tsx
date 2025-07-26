"use client"

import type React from "react"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { Home, FileText, Users, BarChart3 } from "lucide-react"

const salesNavigation = [
  {
    name: "Dashboard",
    href: "/sales",
    icon: Home,
  },
  {
    name: "Sales",
    icon: FileText,
    children: [
      { name: "Sales Orders", href: "/sales/sales-orders" },
      { name: "SO Approvals", href: "/sales/so-approvals" },
      { name: "Quotations", href: "/sales/quotations" },
    ],
  },
  {
    name: "Customers",
    icon: Users,
    children: [
      { name: "Customers", href: "/sales/customers" },
      { name: "Customer Categories", href: "/sales/customer-categories" },
    ],
  },
  {
    name: "Reports",
    href: "/sales/reports",
    icon: BarChart3,
  },
]

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navigation={salesNavigation} basePath="/sales" title="CIAN Pharma ERP - Sales">
      {children}
    </DashboardLayout>
  )
}
