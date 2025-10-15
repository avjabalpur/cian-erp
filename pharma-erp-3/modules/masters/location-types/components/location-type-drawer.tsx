'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { LocationTypeForm } from './location-type-form';
import { CreateLocationTypeData, UpdateLocationTypeData, LocationType } from '../types';
import { toast } from 'sonner';
import { useCreateLocationType, useUpdateLocationType } from '../hooks';

interface LocationTypeDrawerProps {
  locationType: LocationType | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function LocationTypeDrawer({ locationType, open, onOpenChange, mode }: LocationTypeDrawerProps) {
  const createLocationType = useCreateLocationType();
  const updateLocationType = useUpdateLocationType();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Location Type';
      case 'edit':
        return 'Edit Location Type';
      case 'view':
        return 'Location Type Details';
      default:
        return 'Location Type';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      };

      if (locationType) {
        await updateLocationType.mutateAsync({ id: locationType.id, data: payload });
        toast.success('Location type updated successfully');
      } else {
        await createLocationType.mutateAsync(payload);
        toast.success('Location type created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(locationType ? 'Failed to update location type' : 'Failed to create location type');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="xl"
    >
      <LocationTypeForm
        mode={mode}
        locationType={locationType}
        onSubmit={handleSubmit}
        isLoading={createLocationType.isPending || updateLocationType.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}
