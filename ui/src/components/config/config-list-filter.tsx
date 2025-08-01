"use client";

import { useQueryState } from "nuqs";
import {
  NuqsFormInput,
  NuqsFormSelect,
  FilterWrapper,
} from "@/components/shared/filter";
import { configListParsers } from "@/lib/utils/config-list-utils";
import { useState } from "react";

export default function ConfigListFilter() {
  const [search, setSearch] = useQueryState("search", configListParsers.search);
  const [isExpanded, setIsExpanded] = useState(false);

  const clearFilters = () => {
    setSearch(null);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <FilterWrapper
      title="Config List Filters"
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      isExpanded={isExpanded}
      onToggleExpand={setIsExpanded}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <NuqsFormInput
          label="Search"
          value={search}
          onChange={(value) => {
            setSearch(value);
          }}
          placeholder="Search by list code, name..."
        />
      </div>
    </FilterWrapper>
  );
} 