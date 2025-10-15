'use client';

import { useQueryState } from 'nuqs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterWrapper } from '@/components/shared/filter-wrapper';
import { Label } from '@/components/ui/label';

export function UserFilter() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [status, setStatus] = useQueryState('status', { defaultValue: '' });

  const clearFilters = () => {
    setSearch('');
    setStatus('');
  };

  return (
    <FilterWrapper
      title="Advanced User Filters (apply filters to view specific users)"
      defaultExpanded={false}
      activeFiltersCount={[search, status].filter(Boolean).length}
      onClearFilters={clearFilters}
    >
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 py-2">
       <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search users..."
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
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>
    </FilterWrapper>
  );
}

