'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { ItemTypeForm } from './item-type-form';
import { CreateItemTypeData, UpdateItemTypeData, ItemType } from '../types';
import { toast } from 'sonner';
import { useCreateItemType, useUpdateItemType } from '../hooks';

interface ItemTypeDrawerProps {
  itemType: ItemType | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function ItemTypeDrawer({ itemType, open, onOpenChange, mode }: ItemTypeDrawerProps) {
  const createItemType = useCreateItemType();
  const updateItemType = useUpdateItemType();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Item Type';
      case 'edit':
        return 'Edit Item Type';
      case 'view':
        return 'Item Type Details';
      default:
        return 'Item Type';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      };

      if (itemType) {
        await updateItemType.mutateAsync({ id: itemType.id, data: payload });
        toast.success('Item type updated successfully');
      } else {
        await createItemType.mutateAsync(payload);
        toast.success('Item type created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(itemType ? 'Failed to update item type' : 'Failed to create item type');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="xl"
    >
      <ItemTypeForm
        mode={mode}
        itemType={itemType}
        onSubmit={handleSubmit}
        isLoading={createItemType.isPending || updateItemType.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}
