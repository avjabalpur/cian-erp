"use client"
import { useEffect } from "react"
import { useLoginUser } from "@/hooks/use-auth"
import { redirect } from "next/navigation"

export default function HomePage() {
  const { data: user, isLoading } = useLoginUser()

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      const primaryRole = user.roles[0]
      switch (primaryRole) {
        case "SUPER_ADMIN":
        case "ADMIN":
          redirect("/auth/admin")
        case "SALES_MANAGER":
        case "SALES_EXECUTIVE":
          redirect("/auth/sales")
        case "PURCHASE_MANAGER":
        case "PURCHASE_EXECUTIVE":
          redirect("/auth/purchase")
        case "INVENTORY_MANAGER":
        case "INVENTORY_EXECUTIVE":
          redirect("/auth/inventory")
        case "QUALITY_MANAGER":
        case "QUALITY_EXECUTIVE":
          redirect("/auth/quality")
        case "ACCOUNTS_MANAGER":
        case "ACCOUNTS_EXECUTIVE":
          redirect("/auth/accounts")
        default:
          redirect("/auth/dashboard")
      }
    } else if (!isLoading) {
      redirect("/login")
    }
  }, [user, isLoading])

  return null;
}
