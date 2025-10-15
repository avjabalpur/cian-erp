'use client';

import { useQueryState } from 'nuqs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterWrapper } from '@/components/shared/filter-wrapper';
import { Label } from '@/components/ui/label';

export function DepartmentFilter() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [status, setStatus] = useQueryState('status', { defaultValue: '' });

  const clearFilters = () => {
    setSearch('');
    setStatus('');
  };

  return (
    <FilterWrapper
      title="Advanced Department Filters (apply filters to view specific departments)"
      defaultExpanded={false}
      activeFiltersCount={[search, status].filter(Boolean).length}
      onClearFilters={clearFilters}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 py-2">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
         
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status || ''} onValueChange={(value) => setStatus(value || null)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FilterWrapper>
  );
}

