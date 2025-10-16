'use client';

import { useQueryState } from 'nuqs';
import { FilterWrapper } from '@/components/shared/filter-wrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ItemFilter() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [manufactured, setManufactured] = useQueryState('manufactured', { defaultValue: '' });
  const [qcRequired, setQcRequired] = useQueryState('qcRequired', { defaultValue: '' });

  const yesNoOptions = [
    { label: 'All', value: '' },
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  const activeFiltersCount = [search, manufactured, qcRequired].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setManufactured('');
    setQcRequired('');
  };

  return (
    <FilterWrapper
      title="Filter Items"
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-[12px] font-medium">Search</Label>
          <Input
            id="search"
            placeholder="Search by item code, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="manufactured" className="text-[12px] font-medium">Manufactured</Label>
          <Select value={manufactured} onValueChange={(value) => setManufactured(value)}>
            <SelectTrigger id="manufactured">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {yesNoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qcRequired" className="text-[12px] font-medium">QC Required</Label>
          <Select value={qcRequired} onValueChange={(value) => setQcRequired(value)}>
            <SelectTrigger id="qcRequired">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {yesNoOptions.map((option) => (
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

