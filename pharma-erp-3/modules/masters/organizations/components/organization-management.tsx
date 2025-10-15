'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { OrganizationFilter } from './organization-filter';
import { OrganizationTable } from './organization-table';
import { OrganizationDrawer } from './organization-drawer';
import { toast } from 'sonner';
import { Organization } from '../types';
import { useOrganizations, useDeleteOrganization } from '../hooks';

export function OrganizationManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [status] = useQueryState('status', { defaultValue: '' });
  const [locationTypeId] = useQueryState('locationTypeId', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: organizationsData, isLoading, error } = useOrganizations({
    search: search || undefined,
    status: status || undefined,
    locationTypeId: locationTypeId ? parseInt(locationTypeId) : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteOrganization = useDeleteOrganization();
  const organizations = organizationsData?.items || [];
  const totalCount = organizations?.length || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedOrganization(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (organization: Organization) => {
    setSelectedOrganization(organization);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (organization: Organization) => {
    if (confirm(`Are you sure you want to delete organization "${organization.name}"?`)) {
      try {
        await deleteOrganization.mutateAsync(organization.id);
        toast.success('Organization deleted successfully');
      } catch (error) {
        toast.error('Failed to delete organization');
      }
    }
  };

  const handlePaginationChange = (pagination: { pageIndex: number; pageSize: number }) => {
    const newPage = (pagination.pageIndex + 1).toString();
    const newPageSize = pagination.pageSize.toString();
    
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage);
    url.searchParams.set('pageSize', newPageSize);
    window.history.pushState({}, '', url.toString());
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading organizations: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <OrganizationFilter />
          <OrganizationTable
            organizations={organizations}
            isLoading={isLoading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onCreate={handleCreate}
            totalCount={totalCount}
            pageCount={pageCount}
            onPaginationChange={handlePaginationChange}
            currentPagination={currentPagination}
          />
        </CardContent>
      </Card>

      <OrganizationDrawer
        organization={selectedOrganization}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}
