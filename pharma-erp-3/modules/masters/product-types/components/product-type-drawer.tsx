'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { ProductTypeForm } from './product-type-form';
import { CreateProductTypeData, UpdateProductTypeData, ProductType } from '../types';
import { toast } from 'sonner';
import { useCreateProductType, useUpdateProductType } from '../hooks';

interface ProductTypeDrawerProps {
  productType: ProductType | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function ProductTypeDrawer({ productType, open, onOpenChange, mode }: ProductTypeDrawerProps) {
  const createProductType = useCreateProductType();
  const updateProductType = useUpdateProductType();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Product Type';
      case 'edit':
        return 'Edit Product Type';
      case 'view':
        return 'Product Type Details';
      default:
        return 'Product Type';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      };

      if (productType) {
        await updateProductType.mutateAsync({ id: productType.id, data: payload });
        toast.success('Product type updated successfully');
      } else {
        await createProductType.mutateAsync(payload);
        toast.success('Product type created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(productType ? 'Failed to update product type' : 'Failed to create product type');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="xl"
    >
      <ProductTypeForm
        mode={mode}
        productType={productType}
        onSubmit={handleSubmit}
        isLoading={createProductType.isPending || updateProductType.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}
