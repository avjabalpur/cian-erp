"use client"
import { useEffect } from "react"
import { useLoginUser } from "@/hooks/use-auth"
import { redirect } from "next/navigation"

export default function HomePage() {
  const { data: user, isLoading } = useLoginUser()

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      const primaryRole = user?.roles?.[0] || "SUPER_ADMIN"
      // switch (primaryRole) {
      //   case "SUPER_ADMIN":
      //   case "ADMIN":
      //     redirect("/dashboard")
      //   case "SALES_MANAGER":
      //   case "SALES_EXECUTIVE":
      //     redirect("/dashboard")
      //   case "PURCHASE_MANAGER":
      //   case "PURCHASE_EXECUTIVE":
      //     redirect("/dashboard")
      //   case "INVENTORY_MANAGER":
      //   case "INVENTORY_EXECUTIVE":
      //     redirect("/dashboard")
      //   case "QUALITY_MANAGER":
      //   case "QUALITY_EXECUTIVE":
      //     redirect("/dashboard")
      //   case "ACCOUNTS_MANAGER":
      //   case "ACCOUNTS_EXECUTIVE":
      //     redirect("/dashboard")
      //   default:
      //     redirect("/dashboard")
      // }
      redirect("/dashboard")
    } else if (!isLoading) {
      redirect("/login")
    }
  }, [user, isLoading])

  return null;
}
