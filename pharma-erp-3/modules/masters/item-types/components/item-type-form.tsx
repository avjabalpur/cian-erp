'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ItemType } from '../types';
import { itemTypeSchema, ItemTypeFormValues } from '../validations';
import { ItemTypeInformationForm } from './item-type-information-form';

interface ItemTypeFormProps {
  itemType?: ItemType | null;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: ItemTypeFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ItemTypeForm({ itemType, mode, onSubmit, onCancel, isLoading }: ItemTypeFormProps) {
  const form = useForm<ItemTypeFormValues>({
    resolver: zodResolver(itemTypeSchema),
    defaultValues: {
      code: itemType?.code || '',
      name: itemType?.name || '',
      description: itemType?.description || '',
      parentTypeId: itemType?.parentTypeId || undefined,
      isActive: itemType?.isActive ?? true,
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (itemType) {
      reset({
        code: itemType.code || '',
        name: itemType.name || '',
        description: itemType.description || '',
        parentTypeId: itemType.parentTypeId || undefined,
        isActive: itemType.isActive ?? true,
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
  }, [itemType, reset]);

  const handleFormSubmit = async (data: ItemTypeFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit item type:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <ItemTypeInformationForm control={control} currentItemTypeId={itemType?.id} />
        
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
              {isLoading ? 'Saving...' : itemType ? 'Update Item Type' : 'Create Item Type'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
