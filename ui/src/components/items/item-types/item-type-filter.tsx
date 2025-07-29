"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { parseAsString, parseAsBoolean } from "nuqs";
import { Search } from "lucide-react";
import { FilterWrapper } from "@/components/shared/filter/filter-wrapper";
import { NuqsFormInput } from "@/components/shared/filter/nuqs-form-input";
import { NuqsFormSelect } from "@/components/shared/filter/nuqs-form-select";

export default function ItemTypeFilter() {
  const [isExpanded, setIsExpanded] = useState(false);

  // nuqs query state hooks
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [isActive, setIsActive] = useQueryState("isActive", parseAsString.withDefault(""));
  const [page, setPage] = useQueryState("page", parseAsString.withDefault("1"));
  const [pageSize, setPageSize] = useQueryState("pageSize", parseAsString.withDefault("10"));
  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsString.withDefault("createdAt"));
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", parseAsString.withDefault("desc"));

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const sortOptions = [
    { label: "Created Date", value: "createdAt" },
    { label: "Updated Date", value: "updatedAt" },
    { label: "Item Type", value: "itemType" },
    { label: "Description", value: "description" },
  ];

  const sortOrderOptions = [
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  const pageSizeOptions = [
    { label: "10 per page", value: "10" },
    { label: "25 per page", value: "25" },
    { label: "50 per page", value: "50" },
    { label: "100 per page", value: "100" },
  ];

  const clearFilters = () => {
    setSearch(null);
    setIsActive(null);
    setPage("1");
    setPageSize("10");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    if (isActive) count++;
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
          value={search}
          onChange={setSearch}
          placeholder="Search item type name or description..."
          icon={<Search />}
        />
        
        <NuqsFormSelect
          label="Status"
          value={isActive}
          onChange={setIsActive}
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
              value={sortOrder}
              onChange={setSortOrder}
              options={sortOrderOptions}
            />
            
            <NuqsFormSelect
              label="Page Size"
              value={pageSize}
              onChange={setPageSize}
              options={pageSizeOptions}
            />
          </div>
        </div>
      )}
    </FilterWrapper>
  );
} 