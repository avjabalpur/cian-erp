'use client';

import { useQueryState } from 'nuqs';
import { FilterWrapper } from '@/components/shared/filter-wrapper';
import { FormInput } from '@/components/shared/forms/form-input';
import { FormSelect } from '@/components/shared/forms/form-select';

export function ProductTypeFilter() {
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
      title="Filter Product Types"
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="search"
          label="Search"
          placeholder="Search product types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          inputProps={{ type: "text" }}
        />
        
        <FormSelect
          name="isActive"
          label="Status"
          options={statusOptions}
          value={isActive}
          onChange={(value) => setIsActive(value)}
          placeholder="Select status"
        />
      </div>
    </FilterWrapper>
  );
}
