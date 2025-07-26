"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/navigation/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCustomer } from "@/hooks/queries/customers/use-customer"
import { Edit, Mail, Phone, Globe, MapPin, Building, Users, Tag, Clock, ArrowUpRight } from "lucide-react"
import { CustomerBasicInfo } from "@/components/customers/customer-basic-info"
import { CustomerAdditionalDetails } from "@/components/customers/customer-additional-details"
import { CustomerAddress } from "@/components/customers/customer-address"
import { useUser } from "@/hooks/queries/users/use-user"
import UserDetailsLoading from "./loading"
import { UserDetails } from "@/components/users/user-details"


export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: user, isLoading, error } = useUser(id)
  const [activeTab, setActiveTab] = useState("overview")

  if (isLoading) {
    return <UserDetailsLoading />
  }
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Error loading user details</div>
          
        </div>
      </div>
    )
  }
  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "All Users", href: "/users" },
              { label: user.username, href: "/users/" + user.id, current: true },
            ]}
          />
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-3xl font-bold">{user.username}</h1>
          </div>
          <p className="text-muted-foreground mt-1">{user.email}</p>
        </div>
      </div>

      <UserDetails user={user} />
    </div>
  )
}
