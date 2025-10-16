'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { ProductTypeFilter } from './product-type-filter';
import { ProductTypeTable } from './product-type-table';
import { ProductTypeDrawer } from './product-type-drawer';
import { toast } from 'sonner';
import { ProductType } from '../types';
import { useProductTypes, useDeleteProductType } from '../hooks';

export function ProductTypeManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [isActive] = useQueryState('isActive', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: productTypeData, isLoading, error } = useProductTypes({
    search: search || undefined,
    isActive: isActive ? isActive === 'true' : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteProductType = useDeleteProductType();
  const productTypes = productTypeData?.items || [];
  const totalCount = productTypes?.length || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedProductType(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (productType: ProductType) => {
    setSelectedProductType(productType);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (productType: ProductType) => {
    setSelectedProductType(productType);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (productType: ProductType) => {
    if (confirm(`Are you sure you want to delete product type "${productType.name}"?`)) {
      try {
        await deleteProductType.mutateAsync(productType.id);
        toast.success('Product type deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product type');
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
        <p className="text-red-600">Error loading product types: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <ProductTypeFilter />
          <ProductTypeTable
            productTypes={productTypes}
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

      <ProductTypeDrawer
        productType={selectedProductType}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}
