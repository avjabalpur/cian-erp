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

interface ItemOtherDetailsFilters {
  search: string;
  itemId: string;
  detailType: string;
  isActive: boolean | undefined;
}

interface ItemOtherDetailsFilterProps {
  filters: ItemOtherDetailsFilters;
  onFiltersChange: (filters: ItemOtherDetailsFilters) => void;
  onClearFilters: () => void;
}

export default function ItemOtherDetailsFilter({
  filters,
  onFiltersChange,
  onClearFilters,
}: ItemOtherDetailsFilterProps) {
  const updateFilter = (key: keyof ItemOtherDetailsFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.itemId) count++;
    if (filters.detailType) count++;
    if (filters.isActive !== undefined) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by detail name or value..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Item ID */}
        <div className="space-y-2">
          <Label htmlFor="itemId">Item ID</Label>
          <Input
            id="itemId"
            placeholder="Enter item ID"
            value={filters.itemId}
            onChange={(e) => updateFilter("itemId", e.target.value)}
          />
        </div>

        {/* Detail Type */}
        <div className="space-y-2">
          <Label htmlFor="detailType">Detail Type</Label>
          <Select
            value={filters.detailType}
            onValueChange={(value) => updateFilter("detailType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All detail types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All detail types</SelectItem>
              <SelectItem value="specification">Specification</SelectItem>
              <SelectItem value="ingredient">Ingredient</SelectItem>
              <SelectItem value="packaging">Packaging</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="regulatory">Regulatory</SelectItem>
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