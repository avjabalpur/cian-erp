'use client';

import { useQueryState } from 'nuqs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterWrapper } from '@/components/shared/filter-wrapper';
import { Search, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AVAILABLE_MODULES, AVAILABLE_ACTIONS } from '@/hooks/api/use-permissions';

export function PermissionFilter() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [moduleName, setModuleName] = useQueryState('moduleName', { defaultValue: '' });
  const [actionType, setActionType] = useQueryState('actionType', { defaultValue: '' });
  const [status, setStatus] = useQueryState('status', { defaultValue: '' });

  const clearFilters = () => {
    setSearch('');
    setModuleName('');
    setActionType('');
    setStatus('');
  };

  const hasActiveFilters = search || moduleName || actionType || status;

  return (
    <FilterWrapper
      title="Advanced Permission Filters (apply filters to view specific permissions)"
      defaultExpanded={false}
      activeFiltersCount={[search, moduleName, actionType, status].filter(Boolean).length}
      onClearFilters={clearFilters}
    >
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 py-2">

       <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search permissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
         
        <div className="space-y-2">
        <Label htmlFor="moduleName">Module Name</Label>
        <Select value={moduleName || ''} onValueChange={(value) => setModuleName(value === '-1' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">All Modules</SelectItem>
            {AVAILABLE_MODULES.map((module) => (
              <SelectItem key={module} value={module}>
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>

        <div className="space-y-2">
        <Label htmlFor="actionType">Action Type</Label>
        <Select value={actionType || ''} onValueChange={(value) => setActionType(value === '-1' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">All Action Types</SelectItem>
            {AVAILABLE_ACTIONS.map((action) => (
              <SelectItem key={action} value={action}>
                {action.charAt(0).toUpperCase() + action.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
         
        <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status || ''} onValueChange={(value) => setStatus(value === '-1' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>
    </FilterWrapper>
  );
}
