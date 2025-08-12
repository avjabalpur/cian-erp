"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface QuotationFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export function QuotationFilters({ onFiltersChange }: QuotationFiltersProps) {
  const [filters, setFilters] = useState({
    fromDate: null as Date | null,
    toDate: null as Date | null,
    customerName: "",
    companyName: "",
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      fromDate: null,
      toDate: null,
      customerName: "",
      companyName: "",
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== null && value !== ""
  );

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Date Range */}
      <div className="flex items-center gap-2">
        <Label htmlFor="fromDate" className="text-sm font-medium">
          From:
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[140px] justify-start text-left font-normal",
                !filters.fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.fromDate ? format(filters.fromDate, "PPP") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.fromDate}
              onSelect={(date) => handleFilterChange("fromDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="toDate" className="text-sm font-medium">
          To:
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[140px] justify-start text-left font-normal",
                !filters.toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.toDate ? format(filters.toDate, "PPP") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.toDate}
              onSelect={(date) => handleFilterChange("toDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Customer Name */}
      <div className="flex items-center gap-2">
        <Label htmlFor="customerName" className="text-sm font-medium">
          Customer:
        </Label>
        <Input
          id="customerName"
          placeholder="Customer name"
          value={filters.customerName}
          onChange={(e) => handleFilterChange("customerName", e.target.value)}
          className="w-40"
        />
      </div>

      {/* Company Name */}
      <div className="flex items-center gap-2">
        <Label htmlFor="companyName" className="text-sm font-medium">
          Company:
        </Label>
        <Input
          id="companyName"
          placeholder="Company name"
          value={filters.companyName}
          onChange={(e) => handleFilterChange("companyName", e.target.value)}
          className="w-40"
        />
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
