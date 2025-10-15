'use client';

import { useQueryState } from 'nuqs';
import { FilterWrapper } from '@/components/shared/filter-wrapper';
import { FormInput } from '@/components/shared/forms/form-input';
import { FormSelect } from '@/components/shared/forms/form-select';

export function LocationTypeFilter() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [status, setStatus] = useQueryState('status', { defaultValue: '' });

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const activeFiltersCount = [search, status].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setStatus('');
  };

  return (
    <FilterWrapper
      title="Filter Location Types"
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="search"
          label="Search"
          placeholder="Search location types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          inputProps={{ type: "text" }}
        />
        
        <FormSelect
          name="status"
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(value) => setStatus(value)}
          placeholder="Select status"
        />
      </div>
    </FilterWrapper>
  );
}
