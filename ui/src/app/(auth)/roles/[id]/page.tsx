"use client"

import { useRoleById } from "@/hooks/use-roles"
import { use, useState } from "react"
import { RoleInfo } from "@/components/roles/role-info"
import { RolePermission } from "@/components/roles/role-permission"
import { Breadcrumb } from "@/components/shared/breadcrumb"

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: role, isLoading, error } = useRoleById(id as any)

  if (isLoading) {
    return <div>Loading role....</div>
  }
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Error loading role details</div>
        </div>
      </div>
    )
  }
  if (!role) {
    return <div>Role not found</div>
  }

  return (
    <div className="mx-auto">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Roles", href: "/roles" },
          { label: role.name || id, href: `/roles/${id}`, current: true },
        ]}
        className="mb-6"
      />
      <div className="grid grid-cols-1 gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          <RoleInfo role={role} />
          <RolePermission roleId={id as any} />
        </div>
      </div>
    </div>
  )
}
