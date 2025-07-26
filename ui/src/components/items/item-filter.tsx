"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { ItemFilters } from "@/hooks/use-items"

interface ItemFilterProps {
  filters: ItemFilters
  onFiltersChange: (filters: ItemFilters) => void
  onClearFilters: () => void
}

export default function ItemFilter({ filters, onFiltersChange, onClearFilters }: ItemFilterProps) {
  const handleFilterChange = (key: keyof ItemFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const hasActiveFilters =
    filters.search || filters.itemType || filters.status || filters.manufactured || filters.qcRequired

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search items..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Item Type */}
        <Select
          value={filters.itemType || "defaultType"}
          onValueChange={(value) => handleFilterChange("itemType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Item Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="defaultType">All Types</SelectItem>
            <SelectItem value="Finished Product">Finished Product</SelectItem>
            <SelectItem value="Raw Material">Raw Material</SelectItem>
            <SelectItem value="Packaging Material">Packaging Material</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status || "defaultStatus"}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="defaultStatus">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Manufactured */}
        <Select
          value={filters.manufactured || "defaultManufactured"}
          onValueChange={(value) => handleFilterChange("manufactured", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Manufactured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="defaultManufactured">All</SelectItem>
            <SelectItem value="yes">Manufactured</SelectItem>
            <SelectItem value="no">Not Manufactured</SelectItem>
          </SelectContent>
        </Select>

        {/* QC Required */}
        <Select
          value={filters.qcRequired || "defaultQC"}
          onValueChange={(value) => handleFilterChange("qcRequired", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="QC Required" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="defaultQC">All</SelectItem>
            <SelectItem value="yes">QC Required</SelectItem>
            <SelectItem value="no">No QC Required</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
