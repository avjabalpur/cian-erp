'use client';

import { useQueryState } from 'nuqs';
import { FilterWrapper } from '@/components/shared/filter-wrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ConfigListFilter() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [isActive, setIsActive] = useQueryState('isActive', { defaultValue: '' });

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  const activeFiltersCount = [search, isActive].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setIsActive('');
  };

  return (
    <FilterWrapper
      title="Filter Config Lists"
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-[12px] font-medium">Search</Label>
          <Input
            id="search"
            placeholder="Search config lists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="isActive" className="text-[12px] font-medium">Status</Label>
          <Select value={isActive} onValueChange={(value) => setIsActive(value)}>
            <SelectTrigger id="isActive">
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
    </FilterWrapper>
  );
}

