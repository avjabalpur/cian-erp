'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ProductType } from '../types';
import { productTypeSchema, ProductTypeFormValues } from '../validations';
import { ProductTypeInformationForm } from './product-type-information-form';

interface ProductTypeFormProps {
  productType?: ProductType | null;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: ProductTypeFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductTypeForm({ productType, mode, onSubmit, onCancel, isLoading }: ProductTypeFormProps) {
  const form = useForm<ProductTypeFormValues>({
    resolver: zodResolver(productTypeSchema),
    defaultValues: {
      code: productType?.code || '',
      name: productType?.name || '',
      description: productType?.description || '',
      parentTypeId: productType?.parentTypeId || undefined,
      isActive: productType?.isActive ?? true,
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (productType) {
      reset({
        code: productType.code || '',
        name: productType.name || '',
        description: productType.description || '',
        parentTypeId: productType.parentTypeId || undefined,
        isActive: productType.isActive ?? true,
      });
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        parentTypeId: undefined,
        isActive: true,
      });
    }
  }, [productType, reset]);

  const handleFormSubmit = async (data: ProductTypeFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit product type:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <ProductTypeInformationForm control={control} currentProductTypeId={productType?.id} />
        
        {mode !== 'view' && (
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : productType ? 'Update Product Type' : 'Create Product Type'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
