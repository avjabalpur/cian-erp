'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDepartments } from "@/hooks/use-departments"
import { DepartmentDrawer } from "./department-drawer"
import DepartmentTable from "./department-table"

export default function DepartmentsManagement() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any | null>(null)

  const { data: departments = [], isLoading } = useDepartments()

  const handleEdit = (department: any) => {
    setSelectedDepartment(department)
    setDrawerOpen(true)
  }

  const handleDelete = (department: any) => {
    // Implement delete logic here
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="mt-2 text-gray-600">Manage system departments</p>
        </div>
        <Button onClick={() => { setSelectedDepartment(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>
      <DepartmentTable
        departments={departments}
        onEdit={handleEdit}
        isLoading={isLoading}
      />
      <DepartmentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        department={selectedDepartment}
      />
    </div>
  )
} 