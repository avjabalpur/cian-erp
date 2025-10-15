'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { DivisionForm } from './division-form';
import { CreateDivisionData, UpdateDivisionData, Division } from '../types';
import { toast } from 'sonner';
import { useCreateDivision, useUpdateDivision } from '../hooks';

interface DivisionDrawerProps {
  division: Division | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
  departments: { id: number; name: string }[];
}

export function DivisionDrawer({ division, open, onOpenChange, mode, departments }: DivisionDrawerProps) {
  const createDivision = useCreateDivision();
  const updateDivision = useUpdateDivision();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Division';
      case 'edit':
        return 'Edit Division';
      case 'view':
        return 'Division Details';
      default:
        return 'Division';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      };

      if (division) {
        await updateDivision.mutateAsync({ id: division.id, data: payload });
        toast.success('Division updated successfully');
      } else {
        await createDivision.mutateAsync(payload);
        toast.success('Division created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(division ? 'Failed to update division' : 'Failed to create division');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="xl"
    >
      <DivisionForm
        mode={mode}
        division={division}
        onSubmit={handleSubmit}
        isLoading={createDivision.isPending || updateDivision.isPending}
        onCancel={() => onOpenChange(false)}
        departments={departments}
      />
    </RightDrawer>
  );
}
