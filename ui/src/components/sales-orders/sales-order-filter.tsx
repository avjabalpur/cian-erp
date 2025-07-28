"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search } from "lucide-react";
import React from "react";
import {
  NuqsFormInput,
  NuqsFormSelect,
  NuqsFormDateInput,
  type SelectOption
} from "@/components/shared/filter";
import {
  salesOrderStatusOptions,
  paymentTermOptions,
  designUnderOptions,
  currentStatusOptions,
  sortOptions,
  sortOrderOptions,
  salesOrderParsers
} from "@/lib/utils/sales-order-utils";

interface SalesOrderFilterProps {
  onFilterChange: (filters: any) => void;
}

export function SalesOrderFilter({ onFilterChange }: SalesOrderFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current user ID (you can replace this with your actual user context)
  const currentUserId = 1; // TODO: Replace with actual current user ID from context

  // nuqs query state hooks with default values
  const [page, setPage] = useQueryState("page", salesOrderParsers.page);
  const [pageSize, setPageSize] = useQueryState("pageSize", salesOrderParsers.pageSize);
  const [sortBy, setSortBy] = useQueryState("sortBy", salesOrderParsers.sortBy);
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", salesOrderParsers.sortOrder);
  const [search, setSearch] = useQueryState("search", salesOrderParsers.search);
  const [soStatus, setSoStatus] = useQueryState("soStatus", salesOrderParsers.soStatus);
  const [paymentTerm, setPaymentTerm] = useQueryState("paymentTerm", salesOrderParsers.paymentTerm);
  const [designUnder, setDesignUnder] = useQueryState("designUnder", salesOrderParsers.designUnder);
  const [currentStatus, setCurrentStatus] = useQueryState("currentStatus", salesOrderParsers.currentStatus);
  const [isSubmitted, setIsSubmitted] = useQueryState("isSubmitted", salesOrderParsers.isSubmitted);
  const [assignedDesigner, setAssignedDesigner] = useQueryState("assignedDesigner", salesOrderParsers.assignedDesigner);
  const [fromDate, setFromDate] = useQueryState("fromDate", salesOrderParsers.fromDate);
  const [toDate, setToDate] = useQueryState("toDate", salesOrderParsers.toDate);

  // Set default assigned designer to current user if not set
  React.useEffect(() => {
    if (!assignedDesigner) {
      setAssignedDesigner(currentUserId);
    }
  }, [assignedDesigner, currentUserId, setAssignedDesigner]);

  const clearFilters = () => {
    setSearch(null);
    setSoStatus(null);
    setPaymentTerm(null);
    setDesignUnder(null);
    setCurrentStatus(null);
    setIsSubmitted(null);
    setAssignedDesigner(null);
    setFromDate(null);
    setToDate(null);
    setPage(1);
    setPageSize(10);
    setSortBy("created_at");
    setSortOrder("desc");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (search) count++;
    if (soStatus) count++;
    if (paymentTerm) count++;
    if (designUnder) count++;
    if (currentStatus) count++;
    if (isSubmitted !== null) count++;
    if (assignedDesigner && assignedDesigner !== currentUserId) count++; // Only count if not current user
    if (fromDate) count++;
    if (toDate) count++;
    return count;
  };

  const hasAnyFilters = () => {
    return search || soStatus || paymentTerm || designUnder || currentStatus || 
           isSubmitted !== null || (assignedDesigner && assignedDesigner !== currentUserId) || 
           fromDate || toDate;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
            {hasAnyFilters() && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Basic Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <NuqsFormInput
            label="Search"
            value={search}
            onChange={setSearch}
            placeholder="Search SO number, customer, item..."
            icon={<Search />}
          />
          
          <NuqsFormSelect
            label="Status"
            value={soStatus}
            onChange={setSoStatus}
            options={salesOrderStatusOptions}
          />
          
          <NuqsFormSelect
            label="Payment Term"
            value={paymentTerm}
            onChange={setPaymentTerm}
            options={paymentTermOptions}
          />
          
          <NuqsFormSelect
            label="Current Status"
            value={currentStatus}
            onChange={setCurrentStatus}
            options={currentStatusOptions}
          />
        </div>

        {/* Advanced Filters - Expandable */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <NuqsFormSelect
                label="Design Under"
                value={designUnder}
                onChange={setDesignUnder}
                options={designUnderOptions}
              />
              
              <NuqsFormSelect
                label="Submitted"
                value={isSubmitted?.toString() || null}
                onChange={(value) => setIsSubmitted(value === 'true' ? true : value === 'false' ? false : null)}
                options={[
                  { label: "Yes", value: "true" },
                  { label: "No", value: "false" }
                ]}
              />
              
              <NuqsFormInput
                label="Assigned Designer"
                value={assignedDesigner?.toString() || null}
                onChange={(value) => setAssignedDesigner(value ? parseInt(value) : null)}
                placeholder="Designer ID"
                type="number"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuqsFormDateInput
                label="From Date"
                value={fromDate}
                onChange={setFromDate}
                placeholder="Select start date"
              />
              
              <NuqsFormDateInput
                label="To Date"
                value={toDate}
                onChange={setToDate}
                placeholder="Select end date"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuqsFormSelect
                label="Sort By"
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
              />
              
              <NuqsFormSelect
                label="Sort Order"
                value={sortOrder as any}
                onChange={setSortOrder}
                options={sortOrderOptions}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 