"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  salesOrderStatusOptions,
  paymentTermOptions,
  designUnderOptions,
  currentStatusOptions,
  sortOptions,
  sortOrderOptions,
  salesOrderParsers,
  type SelectOption
} from "@/lib/utils/sales-order-utils";

interface SalesOrderFilterProps {
  onFilterChange: (filters: any) => void;
}

export function SalesOrderFilter({ onFilterChange }: SalesOrderFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // nuqs query state hooks
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
    if (assignedDesigner) count++;
    if (fromDate) count++;
    if (toDate) count++;
    return count;
  };

  const renderSelect = (
    label: string,
    value: any | null,
    options: SelectOption[],
    onChange: (value: string | null) => void,
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value || ""} onValueChange={(val) => onChange(val || null)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || `Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderDatePicker = (
    label: string,
    date: Date | null,
    onChange: (date: any | null) => void,
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : placeholder || "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
            {getActiveFilterCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Basic Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SO number, customer, item..."
                value={search || ""}
                onChange={(e) => setSearch(e.target.value || null)}
                className="pl-10"
              />
            </div>
          </div>
          
          {renderSelect(
            "Status",
            soStatus,
            salesOrderStatusOptions,
            setSoStatus
          )}
          
          {renderSelect(
            "Payment Term",
            paymentTerm,
            paymentTermOptions,
            setPaymentTerm
          )}
          
          {renderSelect(
            "Current Status",
            currentStatus,
            currentStatusOptions,
            setCurrentStatus
          )}
        </div>

        {/* Advanced Filters - Expandable */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderSelect(
                "Design Under",
                designUnder,
                designUnderOptions,
                setDesignUnder
              )}
              
              <div className="space-y-2">
                <Label>Submitted</Label>
                <Select 
                  value={isSubmitted?.toString() || ""} 
                  onValueChange={(value) => setIsSubmitted(value === 'true' ? true : value === 'false' ? false : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Assigned Designer</Label>
                <Input
                  type="number"
                  placeholder="Designer ID"
                  value={assignedDesigner?.toString() || ""}
                  onChange={(e) => setAssignedDesigner(e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDatePicker(
                "From Date",
                fromDate,
                setFromDate,
                "Select start date"
              )}
              
              {renderDatePicker(
                "To Date",
                toDate,
                setToDate,
                "Select end date"
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSelect(
                "Sort By",
                sortBy,
                sortOptions,
                setSortBy
              )}
              
              {renderSelect(
                "Sort Order",
                sortOrder,
                sortOrderOptions,
                setSortOrder
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 