"use client";

import { useQueryState } from "nuqs";
import {
  NuqsFormInput,
  NuqsFormSelect,
  FilterWrapper,
} from "@/components/shared/filter";
import { configSettingParsers } from "@/lib/utils/config-setting-utils";

export default function ConfigSettingFilter() {
  // URL state management with nuqs
  const [search, setSearch] = useQueryState("search", configSettingParsers.search);
  const [isActive, setIsActive] = useQueryState("isActive", configSettingParsers.isActive);
  const [page, setPage] = useQueryState("page", configSettingParsers.page);
  const [pageSize, setPageSize] = useQueryState("pageSize", configSettingParsers.pageSize);

  const clearFilters = () => {
    setSearch(null);
    setIsActive(null);
    setPage(1);
    setPageSize(20);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    if (isActive !== null) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <FilterWrapper
      title="Config Settings Filters"
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      showExpandCollapse={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <NuqsFormInput
          label="Search"
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1); // Reset to first page when searching
          }}
          placeholder="Search by setting key, name..."
        />

        <NuqsFormSelect
          label="Status"
          value={isActive?.toString() || null}
          onChange={(value) => {
            setIsActive(value === "true" ? true : value === "false" ? false : null);
            setPage(1);
          }}
          options={[
            { value: "true", label: "Active" },
            { value: "false", label: "Inactive" },
          ]}
          placeholder="Select status"
        />
      </div>
    </FilterWrapper>
  );
} 