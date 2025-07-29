"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Search } from "lucide-react";
import {
  NuqsFormInput,
  NuqsFormSelect,
  FilterWrapper,
} from "@/components/shared/filter";
import {
  statusOptions,
  sortOptions,
  sortOrderOptions,
  pageSizeOptions,
  itemTypeParsers
} from "@/lib/utils/item-master-utils";

interface ItemTypeFilterProps {
  onFilterChange: (filters: any) => void;
}

export function ItemTypeFilter({ onFilterChange }: ItemTypeFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // nuqs query state hooks with default values
  const [page, setPage] = useQueryState("page", itemTypeParsers.page);
  const [pageSize, setPageSize] = useQueryState("pageSize", itemTypeParsers.pageSize);
  const [sortBy, setSortBy] = useQueryState("sortBy", itemTypeParsers.sortBy);
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", itemTypeParsers.sortOrder);
  const [searchTerm, setSearchTerm] = useQueryState("searchTerm", itemTypeParsers.searchTerm);
  const [isActive, setIsActive] = useQueryState("isActive", itemTypeParsers.isActive);

  const clearFilters = () => {
    setSearchTerm(null);
    setIsActive(null);
    setPage(1);
    setPageSize(10);
    setSortBy("created_at");
    setSortOrder("desc");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (isActive !== null) count++;
    return count;
  };

  return (
    <FilterWrapper
      title="Item Type Filters"
      activeFilterCount={getActiveFilterCount()}
      onClearFilters={clearFilters}
      isExpanded={isExpanded}
      onToggleExpand={setIsExpanded}
    >
      {/* Basic Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <NuqsFormInput
          label="Search"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by code, name, or description..."
          icon={<Search />}
        />
        
        <NuqsFormSelect
          label="Status"
          value={isActive?.toString() || ""}
          onChange={(value) => setIsActive(value === 'true' ? true : value === 'false' ? false : null)}
          options={statusOptions}
        />
        
        <NuqsFormSelect
          label="Sort By"
          value={sortBy}
          onChange={setSortBy}
          options={sortOptions}
        />
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuqsFormSelect
              label="Sort Order"
              value={sortOrder as any}
              onChange={setSortOrder}
              options={sortOrderOptions}
            />
            
            <NuqsFormSelect
              label="Page Size"
              value={pageSize?.toString() || "20"}
              onChange={(value) => setPageSize(value ? parseInt(value) : 20)}
              options={pageSizeOptions}
            />
          </div>
        </div>
      )}
    </FilterWrapper>
  );
} 