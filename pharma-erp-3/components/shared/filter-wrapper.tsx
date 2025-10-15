'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FilterWrapperProps {
  children: React.ReactNode;
  title?: string;
  activeFiltersCount?: number;
  onClearFilters?: () => void;
  defaultExpanded?: boolean;
  className?: string;
  // Save filter functionality
  onSaveFilter?: (filterName: string) => void;
  module?: string; // e.g., 'leads', 'customers', etc.
}

export function FilterWrapper({
  children,
  title = 'Filters',
  activeFiltersCount = 0,
  onClearFilters,
  defaultExpanded = false,
  className,
  onSaveFilter,
  module = 'leads',
}: FilterWrapperProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  // Update internal state when defaultExpanded changes
  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast.error('Please enter a filter name');
      return;
    }

    onSaveFilter?.(filterName.trim());
    setFilterName('');
    setIsSaveDialogOpen(false);
    toast.success('Filter saved successfully');
  };

  return (
    <Card className={cn('px-4 py-2 rounded-sm shadow-none', className)} >
      <CardHeader className="p-0 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">{title}</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Save Filter Button */}
            {activeFiltersCount > 0 && onSaveFilter && (
              <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Save Filter</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="filterName">Filter Name</Label>
                      <Input
                        id="filterName"
                        placeholder="Enter filter name..."
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveFilter();
                          }
                        }}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsSaveDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveFilter}>
                        Save Filter
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && onClearFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}

            {/* Expand/Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-2"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-0 ">
          <div className="space-y-4">
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}