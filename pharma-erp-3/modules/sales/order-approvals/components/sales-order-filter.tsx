'use client';

import { useQueryState } from 'nuqs';
import { FilterWrapper } from '@/components/shared/filter-wrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SalesOrderFilterComponent() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [soStatus, setSoStatus] = useQueryState('soStatus', { defaultValue: '' });
  const [currentStatus, setCurrentStatus] = useQueryState('currentStatus', { defaultValue: '' });

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  const currentStatusOptions = [
    { label: 'All', value: '' },
    { label: 'Costing', value: 'Costing' },
    { label: 'QA', value: 'QA' },
    { label: 'Designer', value: 'Designer' },
    { label: 'PM', value: 'PM' },
    { label: 'Final QA', value: 'Final QA' },
    { label: 'Final Authorized', value: 'Final Authorized' },
  ];

  const activeFiltersCount = [search, soStatus, currentStatus].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setSoStatus('');
    setCurrentStatus('');
  };

  return (
    <FilterWrapper
      title="Filter Sales Orders"
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-[12px] font-medium">Search</Label>
          <Input
            id="search"
            placeholder="Search by SO number, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="soStatus" className="text-[12px] font-medium">SO Status</Label>
          <Select value={soStatus} onValueChange={(value) => setSoStatus(value)}>
            <SelectTrigger id="soStatus">
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

        <div className="space-y-2">
          <Label htmlFor="currentStatus" className="text-[12px] font-medium">Current Stage</Label>
          <Select value={currentStatus} onValueChange={(value) => setCurrentStatus(value)}>
            <SelectTrigger id="currentStatus">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {currentStatusOptions.map((option) => (
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

