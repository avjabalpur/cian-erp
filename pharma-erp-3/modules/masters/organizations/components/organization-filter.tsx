'use client';

import { useQueryState } from 'nuqs';
import { FilterWrapper } from '@/components/shared/filter-wrapper';
import { FormInput } from '@/components/shared/forms/form-input';
import { FormSelect } from '@/components/shared/forms/form-select';
import { useLocationTypes } from '@/modules/masters/location-types';

export function OrganizationFilter() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [status, setStatus] = useQueryState('status', { defaultValue: '' });
  const [locationTypeId, setLocationTypeId] = useQueryState('locationTypeId', { defaultValue: '' });

  const { data: locationTypes = [] } = useLocationTypes();

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const locationTypeOptions = [
    { label: 'All Location Types', value: '' },
    ...locationTypes.map(lt => ({ label: lt.name, value: String(lt.id) }))
  ];

  const activeFiltersCount = [search, status, locationTypeId].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setLocationTypeId('');
  };

  return (
    <FilterWrapper
      title="Filter Organizations"
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          name="search"
          label="Search"
          placeholder="Search organizations..."
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
        
        <FormSelect
          name="locationTypeId"
          label="Location Type"
          options={locationTypeOptions}
          value={locationTypeId}
          onChange={(value) => setLocationTypeId(value)}
          placeholder="Select location type"
        />
      </div>
    </FilterWrapper>
  );
}
