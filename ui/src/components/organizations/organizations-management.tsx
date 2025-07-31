'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useOrganizations } from "@/hooks/use-organizations"
import { OrganizationDrawer } from "./organization-drawer"
import OrganizationTable from "./organization-table"

export default function OrganizationsManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<any | null>(null)

  const { data: organizations = [], isLoading } = useOrganizations()

  const handleEdit = (organization: any) => {
    setSelectedOrganization(organization)
    setDrawerOpen(true)
  }

  const handleDelete = (organization: any) => {
    // Implement delete logic here
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
          <p className="mt-2 text-gray-600">Manage system organizations</p>
        </div>
        <Button onClick={() => { setSelectedOrganization(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>
      <OrganizationTable
        organizations={organizations}
        onEdit={handleEdit}
        isLoading={isLoading}
      />
      <OrganizationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        organization={selectedOrganization}
      />
    </div>
  )
} 