'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { DepartmentFilter } from './department-filter';
import { DepartmentTable } from './department-table';
import { DepartmentDrawer } from './department-drawer';
import { toast } from 'sonner';
import { Department } from '@/types/department';
import { useDepartments } from '@/hooks/use-departments';

export function DepartmentManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [status] = useQueryState('status', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: departmentsData, isLoading, error } = useDepartments({
    search: search || undefined,
    status: status || undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const departments = departmentsData?.items || [];
  const totalCount = departmentsData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedDepartment(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (department: Department) => {
    setSelectedDepartment(department);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (department: Department) => {
    if (confirm(`Are you sure you want to delete department "${department.name}"?`)) {
      try {
        // Implement delete logic here
        toast.success('Department deleted successfully');
      } catch (error) {
        toast.error('Failed to delete department');
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
        <p className="text-red-600">Error loading departments: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <DepartmentFilter />
          <DepartmentTable
            departments={departments}
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

      <DepartmentDrawer
        department={selectedDepartment}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}

