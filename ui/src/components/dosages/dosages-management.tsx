'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDosages, useDeleteDosage } from "@/hooks/use-dosages"
import { DosageDrawer } from "./dosage-drawer"
import DosageTable from "./dosage-table"
import { toast } from "@/hooks/use-toast"

export default function DosagesManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedDosage, setSelectedDosage] = useState<any | null>(null)

  const { data: dosagesResponse, isLoading } = useDosages()
  const { mutate: deleteDosage } = useDeleteDosage()

  const dosages = dosagesResponse?.items || []

  const handleEdit = (dosage: any) => {
    setSelectedDosage(dosage)
    setDrawerOpen(true)
  }

  const handleDelete = async (dosage: any) => {
    if (confirm("Are you sure you want to delete this dosage?")) {
      try {
        await deleteDosage(dosage.id)
        toast({ title: 'Success', description: 'Dosage deleted successfully' })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete dosage',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dosage Management</h1>
          <p className="mt-2 text-gray-600">Manage system dosages</p>
        </div>
        <Button onClick={() => { setSelectedDosage(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Dosage
        </Button>
      </div>
      <DosageTable
        dosages={dosages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
      <DosageDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        dosage={selectedDosage}
      />
    </div>
  )
} 