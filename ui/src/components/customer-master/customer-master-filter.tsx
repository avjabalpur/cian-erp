"use client";

import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { CustomerMasterFilter as CustomerMasterFilterType } from "@/types/customer-master";

interface CustomerMasterFilterProps {
  filters: CustomerMasterFilterType;
  onFiltersChange: (filters: CustomerMasterFilterType) => void;
}

export function CustomerMasterFilter({
  filters,
  onFiltersChange,
}: CustomerMasterFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof CustomerMasterFilterType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== "");

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="customerCode">Customer Code</Label>
                <Input
                  id="customerCode"
                  placeholder="Customer Code"
                  value={filters.customerCode || ""}
                  onChange={(e) => handleFilterChange("customerCode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="Customer Name"
                  value={filters.customerName || ""}
                  onChange={(e) => handleFilterChange("customerName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerType">Customer Type</Label>
                <Input
                  id="customerType"
                  placeholder="Customer Type"
                  value={filters.customerTypeCode || ""}
                  onChange={(e) => handleFilterChange("customerTypeCode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  placeholder="GSTIN"
                  value={filters.gstin || ""}
                  onChange={(e) => handleFilterChange("gstin", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.isActive?.toString() || ""}
                  onValueChange={(value) => handleFilterChange("isActive", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exportCustomer">Export Customer</Label>
                <Select
                  value={filters.isExportCustomer?.toString() || ""}
                  onValueChange={(value) => handleFilterChange("isExportCustomer", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Export Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Export Customers</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredDealer">Registered Dealer</Label>
                <Select
                  value={filters.isRegisteredDealer?.toString() || ""}
                  onValueChange={(value) => handleFilterChange("isRegisteredDealer", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Registered Dealers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Registered Dealers</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="continent">Continent</Label>
                <Input
                  id="continent"
                  placeholder="Continent"
                  value={filters.continent || ""}
                  onChange={(e) => handleFilterChange("continent", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 