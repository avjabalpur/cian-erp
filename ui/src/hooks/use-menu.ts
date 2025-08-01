"use client"

import { useMemo } from "react"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  UserCheck,
  Building2,
  Truck,
  ClipboardCheck,
  Calculator,
  Database,
} from "lucide-react"
import { User } from "@/types/user"

export interface MenuItem {
  id: string
  label: string
  href: string
  icon: any
  roles: string[]
  children?: MenuItem[]
}

const allMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "SALES_MANAGER",
      "SALES_EXECUTIVE",
      "PURCHASE_MANAGER",
      "PURCHASE_EXECUTIVE",
      "INVENTORY_MANAGER",
      "INVENTORY_EXECUTIVE",
      "QUALITY_MANAGER",
      "QUALITY_EXECUTIVE",
      "ACCOUNTS_MANAGER",
      "ACCOUNTS_EXECUTIVE",
    ],
  },
  {
    id: "admin",
    label: "Administration",
    href: "/dashboard",
    icon: Settings,
    roles: ["SUPER_ADMIN", "ADMIN"],
    children: [
      {
        id: "users",
        label: "Users",
        href: "/users",
        icon: Users,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "roles",
        label: "Roles",
        href: "/roles",
        icon: UserCheck,
        roles: ["SUPER_ADMIN"],
      },
      {
        id: "permissions",
        label: "Permissions",
        href: "/permissions",
        icon: UserCheck,
        roles: ["SUPER_ADMIN"],
      },
      {
        id: "departments",
        label: "Departments",
        href: "/departments",
        icon: UserCheck,
        roles: ["SUPER_ADMIN"],
      },
      {
        id: "divisions",
        label: "Divisions",
        href: "/divisions",
        icon: UserCheck,
        roles: ["SUPER_ADMIN"],
      },
      {
        id: "customers",
        label: "Customers",
        href: "/customers",
        icon: Building2,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "location-types",
        label: "Location Types",
        href: "/location-types",
        icon: Building2,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "organizations",
        label: "Organizations",
        href: "/organizations",
        icon: Building2,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "dosages",
        label: "Dosages",
        href: "/dosages",
        icon: Building2,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "item-master",
    label: "Item Master",
    href: "/items",
    icon: Package,
    roles: ["SUPER_ADMIN", "ADMIN"],
    children: [ 
      {
        id: "item-type",
        label: "Item Type",
        href: "/items/item-types",
        icon: Package,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "hsn-master",
        label: "HSN Master",
        href: "/items/hsn-master",
        icon: Package,
        roles: ["SUPER_ADMIN"],
      },
      {
        id: "items",
        label: "Items",
        href: "/items",
        icon: Package,
        roles: ["SUPER_ADMIN"],
      },
      
    ],
  },
  {
    id: "sales",
    label: "Sales",
    href: "/sales",
    icon: BarChart3,
    roles: ["SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"],
    children: [
    
      {
        id: "sales-orders",
        label: "Sales Orders",
        href: "/sales/orders",
        icon: ShoppingCart,
        roles: ["SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"],
      },
      {
        id: "quotations",
        label: "Quotations",
        href: "/sales/quotations",
        icon: FileText,
        roles: ["SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"],
      },
    ],
  },
  // {
  //   id: "purchase",
  //   label: "Purchase",
  //   href: "/purchase",
  //   icon: Truck,
  //   roles: ["SUPER_ADMIN", "PURCHASE_MANAGER", "PURCHASE_EXECUTIVE"],
  //   children: [
  //     {
  //       id: "vendors",
  //       label: "Vendors",
  //       href: "/purchase/vendors",
  //       icon: Building2,
  //       roles: ["SUPER_ADMIN", "PURCHASE_MANAGER", "PURCHASE_EXECUTIVE"],
  //     },
  //     {
  //       id: "purchase-orders",
  //       label: "Purchase Orders",
  //       href: "/purchase/orders",
  //       icon: ShoppingCart,
  //       roles: ["SUPER_ADMIN", "PURCHASE_MANAGER", "PURCHASE_EXECUTIVE"],
  //     },
  //     {
  //       id: "purchase-requests",
  //       label: "Purchase Requests",
  //       href: "/purchase/requests",
  //       icon: FileText,
  //       roles: ["SUPER_ADMIN", "PURCHASE_MANAGER", "PURCHASE_EXECUTIVE"],
  //     },
  //   ],
  // },
  // {
  //   id: "inventory",
  //   label: "Inventory",
  //   href: "/inventory",
  //   icon: Package,
  //   roles: ["SUPER_ADMIN", "INVENTORY_MANAGER", "INVENTORY_EXECUTIVE"],
  //   children: [
  //     {
  //       id: "items",
  //       label: "Item Master",
  //       href: "/items",
  //       icon: Package,
  //       roles: ["SUPER_ADMIN", "INVENTORY_MANAGER", "INVENTORY_EXECUTIVE"],
  //     },
  //     {
  //       id: "stock",
  //       label: "Stock Management",
  //       href: "/stock",
  //       icon: BarChart3,
  //       roles: ["SUPER_ADMIN", "INVENTORY_MANAGER", "INVENTORY_EXECUTIVE"],
  //     },
  //     {
  //       id: "warehouses",
  //       label: "Warehouses",
  //       href: "/warehouses",
  //       icon: Building2,
  //       roles: ["SUPER_ADMIN", "INVENTORY_MANAGER"],
  //     },
  //   ],
  // },
  // {
  //   id: "quality",
  //   label: "Quality Control",
  //   href: "/quality",
  //   icon: ClipboardCheck,
  //   roles: ["SUPER_ADMIN", "QUALITY_MANAGER", "QUALITY_EXECUTIVE"],
  //   children: [
  //     {
  //       id: "inspections",
  //       label: "Inspections",
  //       href: "/inspections",
  //       icon: ClipboardCheck,
  //       roles: ["SUPER_ADMIN", "QUALITY_MANAGER", "QUALITY_EXECUTIVE"],
  //     },
  //     {
  //       id: "certificates",
  //       label: "Certificates",
  //       href: "/certificates",
  //       icon: FileText,
  //       roles: ["SUPER_ADMIN", "QUALITY_MANAGER", "QUALITY_EXECUTIVE"],
  //     },
  //   ],
  // },
  // {
  //   id: "accounts",
  //   label: "Accounts",
  //   href: "/accounts",
  //   icon: Calculator,
  //   roles: ["SUPER_ADMIN", "ACCOUNTS_MANAGER", "ACCOUNTS_EXECUTIVE"],
  //   children: [
  //     {
  //       id: "invoices",
  //       label: "Invoices",
  //       href: "/invoices",
  //       icon: FileText,
  //       roles: ["SUPER_ADMIN", "ACCOUNTS_MANAGER", "ACCOUNTS_EXECUTIVE"],
  //     },
  //     {
  //       id: "payments",
  //       label: "Payments",
  //       href: "/payments",
  //       icon: Calculator,
  //       roles: ["SUPER_ADMIN", "ACCOUNTS_MANAGER", "ACCOUNTS_EXECUTIVE"],
  //     },
  //   ],
  // },
]

export function useMenu(user: User | null) {
  const menuItems = useMemo(() => {
    if (!user) return []

    const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
      return items.filter((item) => {
        const hasAccess = item.roles.some((role) => user.roles.includes(role))
        if (!hasAccess) return false

        if (item.children) {
          item.children = filterMenuItems(item.children)
        }

        return true
      })
    }

    return filterMenuItems(allMenuItems)
  }, [user])

  const hasPermission = (permission: string) => {
    if (!user) return false
    return true; // TODO: Implement permission check
  }

  const hasRole = (role: string) => {
    if (!user) return false
    return user.roles.includes(role)
  }

  return {
    menuItems,
    hasPermission,
    hasRole,
  }
}
