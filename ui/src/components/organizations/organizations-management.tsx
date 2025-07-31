'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useOrganizations } from "@/hooks/use-organizations"
import { OrganizationDrawer } from "./organization-drawer"
import OrganizationTable from "./organization-table"
import { Organization } from "@/types/organization"

export default function OrganizationsManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<any | null>(null)

  const { data: organizations = { items: [], totalCount: 0, pageCount: 0 }, isLoading } = useOrganizations()

  const handleEdit = (organization: any) => {
    setSelectedOrganization(organization)
    setDrawerOpen(true)
  }

  const handleDelete = (organization: any) => {
    // Implement delete logic here
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Organization Management</h1>
        </div>
        <Button onClick={() => { setSelectedOrganization(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>
      <OrganizationTable
        organizations={organizations.items}
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