"use client";

import { useQueryState } from "nuqs";
import { parseAsString, parseAsBoolean } from "nuqs";
import { FilterWrapper } from "@/components/shared/filter/filter-wrapper";
import { NuqsFormInput } from "@/components/shared/filter/nuqs-form-input";
import { NuqsFormSelect } from "@/components/shared/filter/nuqs-form-select";
import { useState } from "react";

export default function ItemsFilter() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [itemType, setItemType] = useQueryState("itemType", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault(""));
  const [manufactured, setManufactured] = useQueryState("manufactured", parseAsString.withDefault(""));
  const [qcRequired, setQcRequired] = useQueryState("qcRequired", parseAsString.withDefault(""));
  const [isExpanded, setIsExpanded] = useState(false);

  const itemTypeOptions = [
    { label: "Tablet", value: "tablet" },
    { label: "Capsule", value: "capsule" },
    { label: "Syrup", value: "syrup" },
    { label: "Injection", value: "injection" },
    { label: "Cream", value: "cream" },
    { label: "Ointment", value: "ointment" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const yesNoOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const clearFilters = () => {
    setSearch(null);
    setItemType(null);
    setStatus(null);
    setManufactured(null);
    setQcRequired(null);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    if (itemType) count++;
    if (status) count++;
    if (manufactured) count++;
    if (qcRequired) count++;
    return count;
  };

  return (
    <FilterWrapper
      activeFilterCount={getActiveFilterCount()}
      onClearFilters={clearFilters}
      isExpanded={isExpanded}
      onToggleExpand={setIsExpanded}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuqsFormInput
          label="Search"
          placeholder="Search by item code, name, or short name..."
          value={search}
          onChange={setSearch}
        />

        <NuqsFormSelect
          label="Item Type"
          value={itemType}
          onChange={setItemType}
          options={itemTypeOptions}
        />

        <NuqsFormSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={statusOptions}
        />

        <NuqsFormSelect
          label="Manufactured"
          value={manufactured}
          onChange={setManufactured}
          options={yesNoOptions}
        />

        <NuqsFormSelect
          label="QC Required"
          value={qcRequired}
          onChange={setQcRequired}
          options={yesNoOptions}
        />
      </div>
    </FilterWrapper>
  );
} 