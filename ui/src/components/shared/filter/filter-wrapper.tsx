"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterWrapperProps {
  title?: string;
  children: React.ReactNode;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  className?: string;
  showExpandCollapse?: boolean;
  showClearButton?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
}

export function FilterWrapper({
  title = "Filters",
  children,
  activeFilterCount = 0,
  onClearFilters,
  className,
  showExpandCollapse = true,
  showClearButton = true,
  isExpanded: externalIsExpanded,
  onToggleExpand
}: FilterWrapperProps) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const setIsExpanded = onToggleExpand || setInternalIsExpanded;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <Card className={cn("mb-4", className)}>
      <CardHeader className="pb-1 pt-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {title}
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {showExpandCollapse && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleExpand}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
            {showClearButton && hasActiveFilters && onClearFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-blue-600 hover:text-blue-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
} 