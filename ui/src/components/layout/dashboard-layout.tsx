"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLogout } from "@/hooks/use-auth"
import { useMenu } from "@/hooks/use-menu"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { MobileSidebar } from "./mobile-sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  basePath: string
  title: string
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [user, setUser] = useState<any>(null)
  const logout = useLogout()
  const navigation = useMenu(user)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Failed to parse user data:", error)
        logout()
      }
    } else {
      router.push("/login")
    }
  }, [router, logout])

  const handleLogout = () => {
    logout()
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar navigation={navigation.menuItems} title={title} isCollapsed={sidebarCollapsed} />
      <MobileSidebar navigation={navigation.menuItems} title={title} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar}
          isCollapsed={sidebarCollapsed}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="mx-auto px-2 sm:px-4 lg:px-6 py-4">{children}</div>
        </main>
      </div>
    </div>
  )
}
