"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Search, User } from "lucide-react";
import React from "react";
import {
  NuqsFormInput,
  NuqsFormSelect,
  NuqsFormDateInput,
  FilterWrapper
} from "@/components/shared/filter";
import type { SelectOption } from "@/components/shared/filter/nuqs-form-select";
import { DatePickerWithRange } from "@/components/shared/forms/date-range-picker";
import { Label } from "@/components/ui/label";
import {
  quotationStatusOptions,
  companyOptions,
  quotationParsers
} from "@/lib/utils/quotation-utils";

export function QuotationFilter() {

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

  const clearFilters = () => {
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

  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    if (companyName) count++;
    if (customerName) count++;
    if (status) count++;
    if (createdBy !== null) count++;
    if (fromDate) count++;
    if (toDate) count++;
    if (sortBy !== "created_at") count++;
    if (sortOrder !== "desc") count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Convert quotation status options to SelectOption format
  const statusSelectOptions: SelectOption[] = [
    { value: "-1", label: "All Statuses" },
    ...quotationStatusOptions.map((option: any) => ({
      value: option.value,
      label: option.label
    }))
  ];

  // Convert company options to SelectOption format
  const companySelectOptions: SelectOption[] = companyOptions.map((option: any) => ({
    value: option.value,
    label: option.label
  }));



  // Create date range for the date picker
  const dateRange = fromDate && toDate ? { from: fromDate, to: toDate } : undefined;

  const handleDateRangeChange = (range: any) => {
    if (range?.from) {
      setFromDate(range.from);
    } else {
      setFromDate(null);
    }
    if (range?.to) {
      setToDate(range.to);
    } else {
      setToDate(null);
    }
  };

  return (
    <>
      <FilterWrapper
        title="Filter Quotations"
        activeFilterCount={activeFilterCount}
        onClearFilters={clearFilters}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search */}
          <NuqsFormInput
            label="Search"
            placeholder="Search quotations..."
            value={search}
            onChange={setSearch}
            icon={<Search className="h-4 w-4" />}
          />

          {/* Company Name */}
          <NuqsFormSelect
            label="Company"
            placeholder="Select company"
            value={companyName}
            onChange={setCompanyName}
            options={companySelectOptions}
          />

        

          {/* Status */}
          <NuqsFormSelect
            label="Status"
            placeholder="Select status"
            value={status}
            onChange={setStatus}
            options={statusSelectOptions}
          />

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DatePickerWithRange
              date={dateRange}
              onDateChange={handleDateRangeChange}
              placeholder="Select date range"
            />
          </div>
        </div>
      </FilterWrapper>
    </>
  );
}
