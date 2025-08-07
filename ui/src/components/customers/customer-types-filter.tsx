"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";
import { CustomerTypeFilter } from "@/types/customer-type";

interface CustomerTypesFilterProps {
  filter: CustomerTypeFilter;
  onFilterChange: (filter: CustomerTypeFilter) => void;
}

export default function CustomerTypesFilter({ filter, onFilterChange }: CustomerTypesFilterProps) {
  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const exportTypeOptions = [
    { label: "All", value: "" },
    { label: "Export Type", value: "true" },
    { label: "Domestic Type", value: "false" },
  ];

  const domesticTypeOptions = [
    { label: "All", value: "" },
    { label: "Domestic Type", value: "true" },
    { label: "Export Type", value: "false" },
  ];

  const drugLicenseOptions = [
    { label: "All", value: "" },
    { label: "Requires Drug License", value: "true" },
    { label: "No Drug License Required", value: "false" },
  ];

  const creditTermsOptions = [
    { label: "All", value: "" },
    { label: "Credit Terms Applicable", value: "true" },
    { label: "No Credit Terms", value: "false" },
  ];

  const handleClearFilters = () => {
    onFilterChange({
      page: 1,
      pageSize: 20,
      sortBy: 'name',
      sortDescending: false,
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-1 pt-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4" />
            Filter Customer Types
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="text-blue-600 hover:text-blue-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Search</Label>
            <Input 
              placeholder="Search customer types..." 
              value={filter.search || ""}
              onChange={(e) => onFilterChange({ ...filter, search: e.target.value, page: 1 })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Code</Label>
            <Input 
              placeholder="Code" 
              value={filter.code || ""}
              onChange={(e) => onFilterChange({ ...filter, code: e.target.value, page: 1 })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Name</Label>
            <Input 
              placeholder="Name" 
              value={filter.name || ""}
              onChange={(e) => onFilterChange({ ...filter, name: e.target.value, page: 1 })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Export Type</Label>
            <Select 
              value={filter.isExportType?.toString() || ""}
              onValueChange={(value) => onFilterChange({ 
                ...filter, 
                isExportType: value === "" ? undefined : value === "true", 
                page: 1 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select export type" />
              </SelectTrigger>
              <SelectContent>
                {exportTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Domestic Type</Label>
            <Select 
              value={filter.isDomesticType?.toString() || ""}
              onValueChange={(value) => onFilterChange({ 
                ...filter, 
                isDomesticType: value === "" ? undefined : value === "true", 
                page: 1 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domestic type" />
              </SelectTrigger>
              <SelectContent>
                {domesticTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Drug License</Label>
            <Select 
              value={filter.requiresDrugLicense?.toString() || ""}
              onValueChange={(value) => onFilterChange({ 
                ...filter, 
                requiresDrugLicense: value === "" ? undefined : value === "true", 
                page: 1 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select drug license" />
              </SelectTrigger>
              <SelectContent>
                {drugLicenseOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Credit Terms</Label>
            <Select 
              value={filter.creditTermsApplicable?.toString() || ""}
              onValueChange={(value) => onFilterChange({ 
                ...filter, 
                creditTermsApplicable: value === "" ? undefined : value === "true", 
                page: 1 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select credit terms" />
              </SelectTrigger>
              <SelectContent>
                {creditTermsOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-medium">Status</Label>
            <Select 
              value={filter.isActive?.toString() || ""}
              onValueChange={(value) => onFilterChange({ 
                ...filter, 
                isActive: value === "" ? undefined : value === "true", 
                page: 1 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
