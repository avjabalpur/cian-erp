import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDivisions } from "@/hooks/use-divisions"
import { useDepartments } from "@/hooks/use-departments"
import { DivisionDrawer } from "./division-drawer"
import DivisionTable from "./division-table"

export default function DivisionsManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedDivision, setSelectedDivision] = useState<any | null>(null)

  const { data: divisions = [], isLoading } = useDivisions()
  const { data: departments = [] } = useDepartments()

  const handleEdit = (division: any) => {
    setSelectedDivision(division)
    setDrawerOpen(true)
  }

  const handleDelete = (division: any) => {
    // Implement delete logic here
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Division Management</h1>
          <p className="mt-2 text-gray-600">Manage system divisions</p>
        </div>
        <Button onClick={() => { setSelectedDivision(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Division
        </Button>
      </div>
      <DivisionTable
        divisions={divisions}
        departments={departments}
        onEdit={handleEdit}
        isLoading={isLoading}
      />
      <DivisionDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        division={selectedDivision}
        departments={departments}
      />
    </div>
  )
} 