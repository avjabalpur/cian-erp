"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useItems, type Item, type ItemFilters } from "@/hooks/use-items"
import ItemFilter from "./item-filter"
import ItemTable from "./item-table"

export default function ItemsManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, loading, deleteItem } = useItems()

  const [filters, setFilters] = useState<ItemFilters>({
    search: "",
    itemType: "",
    status: "",
    manufactured: "",
    qcRequired: "",
  })

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.itemName.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.shortName.toLowerCase().includes(filters.search.toLowerCase())

      const matchesType = !filters.itemType || item.itemType === filters.itemType

      const matchesStatus =
        !filters.status ||
        (filters.status === "active" && item.isActive) ||
        (filters.status === "inactive" && !item.isActive)

      const matchesManufactured =
        !filters.manufactured ||
        (filters.manufactured === "yes" && item.manufactured) ||
        (filters.manufactured === "no" && !item.manufactured)

      const matchesQC =
        !filters.qcRequired ||
        (filters.qcRequired === "yes" && item.qcRequired) ||
        (filters.qcRequired === "no" && !item.qcRequired)

      return matchesSearch && matchesType && matchesStatus && matchesManufactured && matchesQC
    })
  }, [items, filters])

  const handleCreateItem = () => {
    router.push("/admin/items/create")
  }

  const handleViewItem = (item: Item) => {
    router.push(`/admin/items/${item.id}`)
  }

  const handleEditItem = (item: Item) => {
    router.push(`/admin/items/${item.id}/edit`)
  }

  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      await deleteItem(id)
      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      itemType: "",
      status: "",
      manufactured: "",
      qcRequired: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Item Master</h1>
          <p className="mt-2 text-gray-600">Manage pharmaceutical items and products</p>
        </div>
        <Button onClick={handleCreateItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find items using various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemFilter filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>A list of all pharmaceutical items with their details and status</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemTable
            items={filteredItems}
            loading={loading}
            onView={handleViewItem}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        </CardContent>
      </Card>
    </div>
  )
}
