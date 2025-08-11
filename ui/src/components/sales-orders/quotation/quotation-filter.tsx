"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Search, User } from "lucide-react";
import React from "react";
import {
  NuqsFormInput,
  NuqsFormSelect,
  NuqsFormDateInput,
  FilterWrapper,
  type SelectOption
} from "@/components/shared/filter";
import { UserLookup } from "@/components/shared/lookups";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  quotationStatusOptions,
  companyOptions,
  quotationSortOptions,
  sortOrderOptions,
  quotationParsers
} from "@/lib/utils/quotation-utils";

interface QuotationFilterProps {
  onFilterChange: (filters: any) => void;
}

// Custom input component for created by with lookup
interface CreatedByInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onLookupClick: () => void;
}

function CreatedByInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
  onLookupClick
}: CreatedByInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`input-${label}`}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={`input-${label}`}
          type="number"
          placeholder={placeholder}
          value={value?.toString() || ""}
          onChange={(e) => {
            const num = parseInt(e.target.value);
            onChange(isNaN(num) ? null : num);
          }}
          disabled={disabled}
          className={cn("flex-1", className)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onLookupClick}
          disabled={disabled}
          className="px-2"
        >
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function QuotationFilter({ onFilterChange }: QuotationFilterProps) {
  const [userLookupOpen, setUserLookupOpen] = useState(false);

  // nuqs query state hooks - these automatically sync with URL
  const [search, setSearch] = useQueryState("search", quotationParsers.search);
  const [companyName, setCompanyName] = useQueryState("companyName", quotationParsers.companyName);
  const [customerName, setCustomerName] = useQueryState("customerName", quotationParsers.customerName);
  const [status, setStatus] = useQueryState("status", quotationParsers.status);
  const [createdBy, setCreatedBy] = useQueryState("createdBy", quotationParsers.createdBy);
  const [fromDate, setFromDate] = useQueryState("fromDate", quotationParsers.fromDate);
  const [toDate, setToDate] = useQueryState("toDate", quotationParsers.toDate);
  const [sortBy, setSortBy] = useQueryState("sortBy", quotationParsers.sortBy);
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", quotationParsers.sortOrder);

  const handleUserSelect = (user: any) => {
    setCreatedBy(user.id);
    setUserLookupOpen(false);
  };

  const handleReset = () => {
    setSearch("");
    setCompanyName("");
    setCustomerName("");
    setStatus("");
    setCreatedBy(null);
    setFromDate(null);
    setToDate(null);
    setSortBy("created_at");
    setSortOrder("desc");
  };

  // Convert quotation status options to SelectOption format
  const statusSelectOptions: SelectOption[] = [
    { value: "", label: "All Statuses" },
    ...quotationStatusOptions.map(option => ({
      value: option.value,
      label: option.label
    }))
  ];

  return (
    <>
      <FilterWrapper onReset={handleReset}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search */}
          <NuqsFormInput
            label="Search"
            placeholder="Search quotations..."
            value={search}
            onChange={setSearch}
            icon={Search}
          />

          {/* Company Name */}
          <NuqsFormSelect
            label="Company"
            placeholder="Select company"
            value={companyName}
            onChange={setCompanyName}
            options={companyOptions}
          />

          {/* Customer Name */}
          <NuqsFormInput
            label="Customer Name"
            placeholder="Enter customer name"
            value={customerName}
            onChange={setCustomerName}
          />

          {/* Status */}
          <NuqsFormSelect
            label="Status"
            placeholder="Select status"
            value={status}
            onChange={setStatus}
            options={statusSelectOptions}
          />

          {/* Created By */}
          <CreatedByInput
            label="Created By"
            value={createdBy}
            onChange={setCreatedBy}
            placeholder="Enter user ID"
            onLookupClick={() => setUserLookupOpen(true)}
          />

          {/* From Date */}
          <NuqsFormDateInput
            label="From Date"
            value={fromDate}
            onChange={setFromDate}
          />

          {/* To Date */}
          <NuqsFormDateInput
            label="To Date"
            value={toDate}
            onChange={setToDate}
          />

          {/* Sort By */}
          <NuqsFormSelect
            label="Sort By"
            placeholder="Select sort field"
            value={sortBy}
            onChange={setSortBy}
            options={quotationSortOptions}
          />

          {/* Sort Order */}
          <NuqsFormSelect
            label="Sort Order"
            placeholder="Select sort order"
            value={sortOrder}
            onChange={setSortOrder}
            options={sortOrderOptions}
          />
        </div>
      </FilterWrapper>

      {/* User Lookup Modal */}
      <UserLookup
        isOpen={userLookupOpen}
        onClose={() => setUserLookupOpen(false)}
        onSelect={handleUserSelect}
        title="Select User"
      />
    </>
  );
}
