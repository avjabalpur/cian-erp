'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { DosageForm } from './dosage-form';
import { CreateDosageData, UpdateDosageData, Dosage } from '../types';
import { toast } from 'sonner';
import { useCreateDosage, useUpdateDosage } from '../hooks';

interface DosageDrawerProps {
  dosage: Dosage | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function DosageDrawer({ dosage, open, onOpenChange, mode }: DosageDrawerProps) {
  const createDosage = useCreateDosage();
  const updateDosage = useUpdateDosage();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Dosage';
      case 'edit':
        return 'Edit Dosage';
      case 'view':
        return 'Dosage Details';
      default:
        return 'Dosage';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      };

      if (dosage) {
        await updateDosage.mutateAsync({ id: dosage.id, data: payload });
        toast.success('Dosage updated successfully');
      } else {
        await createDosage.mutateAsync(payload);
        toast.success('Dosage created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(dosage ? 'Failed to update dosage' : 'Failed to create dosage');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="xl"
    >
      <DosageForm
        mode={mode}
        dosage={dosage}
        onSubmit={handleSubmit}
        isLoading={createDosage.isPending || updateDosage.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}
