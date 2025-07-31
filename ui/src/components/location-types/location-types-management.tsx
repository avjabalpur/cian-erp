'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useLocationTypes } from "@/hooks/use-location-types"
import { LocationTypeDrawer } from "./location-type-drawer"
import LocationTypeTable from "./location-type-table"

export default function LocationTypesManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedLocationType, setSelectedLocationType] = useState<any | null>(null)

  const { data: locationTypes = [], isLoading } = useLocationTypes()

  const handleEdit = (locationType: any) => {
    setSelectedLocationType(locationType)
    setDrawerOpen(true)
  }

  const handleDelete = (locationType: any) => {
    // Implement delete logic here
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Location Type Management</h1>
          <p className="mt-2 text-gray-600">Manage system location types</p>
        </div>
        <Button onClick={() => { setSelectedLocationType(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Location Type
        </Button>
      </div>
      <LocationTypeTable
        locationTypes={locationTypes}
        onEdit={handleEdit}
        isLoading={isLoading}
      />
      <LocationTypeDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        locationType={selectedLocationType}
      />
    </div>
  )
} 