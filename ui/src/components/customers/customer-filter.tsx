"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { CustomerFilters } from "@/hooks/use-customers"

interface CustomerFilterProps {
  filters: CustomerFilters
  onFiltersChange: (filters: CustomerFilters) => void
  onClearFilters: () => void
}

export default function CustomerFilter({ filters, onFiltersChange, onClearFilters }: CustomerFilterProps) {
  const handleFilterChange = (key: keyof CustomerFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const hasActiveFilters = filters.search || filters.customerType || filters.status || filters.city

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search customers..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customer Type */}
        <Select value={filters.customerType} onValueChange={(value) => handleFilterChange("customerType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Customer Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="hospital">Hospital</SelectItem>
            <SelectItem value="pharmacy">Pharmacy</SelectItem>
            <SelectItem value="distributor">Distributor</SelectItem>
            <SelectItem value="clinic">Clinic</SelectItem>
            <SelectItem value="retailer">Retailer</SelectItem>
            <SelectItem value="government">Government</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* City */}
        <Select value={filters.city} onValueChange={(value) => handleFilterChange("city", value)}>
          <SelectTrigger>
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="bangalore">Bangalore</SelectItem>
            <SelectItem value="hyderabad">Hyderabad</SelectItem>
            <SelectItem value="chennai">Chennai</SelectItem>
            <SelectItem value="kolkata">Kolkata</SelectItem>
            <SelectItem value="pune">Pune</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
