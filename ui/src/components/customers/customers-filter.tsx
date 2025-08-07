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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { customerFilterParsers } from "@/lib/utils/customer-utils";

export default function CustomersFilter() {
  const [isExpanded, setIsExpanded] = useState(false);

  // URL state management with nuqs
  const [search, setSearch] = useQueryState("search", customerFilterParsers.search);
  const [customerCode, setCustomerCode] = useQueryState("customerCode", customerFilterParsers.customerCode);
  const [customerName, setCustomerName] = useQueryState("customerName", customerFilterParsers.customerName);
  const [customerTypeCode, setCustomerTypeCode] = useQueryState("customerTypeCode", customerFilterParsers.customerTypeCode);
  const [gstin, setGstin] = useQueryState("gstin", customerFilterParsers.gstin);
  const [isActive, setIsActive] = useQueryState("isActive", customerFilterParsers.isActive);
  const [isExportCustomer, setIsExportCustomer] = useQueryState("isExportCustomer", customerFilterParsers.isExportCustomer);

  const handleClearFilters = () => {
    setSearch(null);
    setCustomerCode(null);
    setCustomerName(null);
    setCustomerTypeCode(null);
    setGstin(null);
    setIsActive(null);
    setIsExportCustomer(null);
  };

  const hasActiveFilters = search || customerCode || customerName || customerTypeCode || gstin || isActive !== null || isExportCustomer !== null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Hide" : "Show"} Advanced
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search customers..."
                value={search || ""}
                onChange={(e) => setSearch(e.target.value || null)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerCode">Customer Code</Label>
            <Input
              id="customerCode"
              placeholder="Enter customer code"
              value={customerCode || ""}
              onChange={(e) => setCustomerCode(e.target.value || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              placeholder="Enter customer name"
              value={customerName || ""}
              onChange={(e) => setCustomerName(e.target.value || null)}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="customerType">Customer Type</Label>
              <Select value={customerTypeCode || ""} onValueChange={(value) => setCustomerTypeCode(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="DOMESTIC">Domestic</SelectItem>
                  <SelectItem value="EXPORT">Export</SelectItem>
                  <SelectItem value="GOVERNMENT">Government</SelectItem>
                  <SelectItem value="INSTITUTIONAL">Institutional</SelectItem>
                  <SelectItem value="RETAIL">Retail</SelectItem>
                  <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input
                id="gstin"
                placeholder="Enter GSTIN"
                value={gstin || ""}
                onChange={(e) => setGstin(e.target.value || null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <Select value={isActive?.toString() || ""} onValueChange={(value) => setIsActive(value === "" ? null : value === "true")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isExportCustomer">Export Customer</Label>
              <Select value={isExportCustomer?.toString() || ""} onValueChange={(value) => setIsExportCustomer(value === "" ? null : value === "true")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select export type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Customers</SelectItem>
                  <SelectItem value="true">Export</SelectItem>
                  <SelectItem value="false">Domestic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 