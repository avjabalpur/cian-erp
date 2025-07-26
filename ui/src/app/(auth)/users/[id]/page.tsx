"use client"

import { UserActivities } from "@/components/users/user-activity"
import { UserInfo } from "@/components/users/user-info"
import { UserRoles } from "@/components/users/user-roles"
import { useUserById } from "@/hooks/use-users"
import { use, useState } from "react"
import { Breadcrumb } from "@/components/shared/breadcrumb"

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: user, isLoading, error } = useUserById(id)

  if (isLoading) {
    return <div>Loading user....</div>
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
    <div className="mx-auto">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Users", href: "/users" },
          { label: user.firstName + " " + user.lastName || id, href: `/users/${id}`, current: true },
        ]}
        className="mb-6"
      />
      <div className="grid grid-cols-1 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <UserInfo user={user} />
          <UserRoles userId={id} />
        </div>

       {/*  <div className="space-y-6">
          <UserActivities activities={[]} />
        </div> */}
      </div>
    </div>
  )
}
