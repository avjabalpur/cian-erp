"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface HsnMasterFilters {
  search: string;
  hsnType: string;
  isActive: boolean | undefined;
}

interface HsnMasterFilterProps {
  filters: HsnMasterFilters;
  onFiltersChange: (filters: HsnMasterFilters) => void;
  onClearFilters: () => void;
}

export default function HsnMasterFilter({
  filters,
  onFiltersChange,
  onClearFilters,
}: HsnMasterFilterProps) {
  const updateFilter = (key: keyof HsnMasterFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.hsnType) count++;
    if (filters.isActive !== undefined) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by HSN code, description, or type..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* HSN Type */}
        <div className="space-y-2">
          <Label htmlFor="hsnType">HSN Type</Label>
          <Select
            value={filters.hsnType}
            onValueChange={(value) => updateFilter("hsnType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All HSN types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All HSN types</SelectItem>
              <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
              <SelectItem value="medical_device">Medical Device</SelectItem>
              <SelectItem value="cosmetic">Cosmetic</SelectItem>
              <SelectItem value="supplement">Supplement</SelectItem>
              <SelectItem value="chemical">Chemical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.isActive === undefined ? "" : filters.isActive.toString()}
            onValueChange={(value) => {
              if (value === "") {
                updateFilter("isActive", undefined);
              } else {
                updateFilter("isActive", value === "true");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <span className="text-sm text-muted-foreground">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? "s" : ""} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 