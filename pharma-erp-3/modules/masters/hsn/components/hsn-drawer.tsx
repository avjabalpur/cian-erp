'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { HsnForm } from './hsn-form';
import { CreateHsnMasterData, UpdateHsnMasterData, HsnMaster } from '../types';
import { toast } from 'sonner';
import { useCreateHsnMaster, useUpdateHsnMaster } from '../hooks';

interface HsnDrawerProps {
  hsnMaster: HsnMaster | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function HsnDrawer({ hsnMaster, open, onOpenChange, mode }: HsnDrawerProps) {
  const createHsnMaster = useCreateHsnMaster();
  const updateHsnMaster = useUpdateHsnMaster();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New HSN Master';
      case 'edit':
        return 'Edit HSN Master';
      case 'view':
        return 'HSN Master Details';
      default:
        return 'HSN Master';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
        isReverseCharges: data.isReverseCharges ?? false,
      };

      if (hsnMaster) {
        await updateHsnMaster.mutateAsync({ id: hsnMaster.id, data: payload });
        toast.success('HSN master updated successfully');
      } else {
        await createHsnMaster.mutateAsync(payload);
        toast.success('HSN master created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(hsnMaster ? 'Failed to update HSN master' : 'Failed to create HSN master');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="xl"
    >
      <HsnForm
        mode={mode}
        hsnMaster={hsnMaster}
        onSubmit={handleSubmit}
        isLoading={createHsnMaster.isPending || updateHsnMaster.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}
