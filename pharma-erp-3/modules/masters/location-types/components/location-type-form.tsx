'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { LocationType } from '../types';
import { locationTypeFormSchema, LocationTypeFormValues } from '../validations';
import { LocationTypeInformationForm } from './location-type-information-form';

interface LocationTypeFormProps {
  locationType?: LocationType | null;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: LocationTypeFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LocationTypeForm({ locationType, mode, onSubmit, onCancel, isLoading }: LocationTypeFormProps) {
  const form = useForm<LocationTypeFormValues>({
    resolver: zodResolver(locationTypeFormSchema),
    defaultValues: {
      code: locationType?.code || '',
      name: locationType?.name || '',
      isActive: locationType?.isActive ?? true,
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (locationType) {
      reset({
        code: locationType.code || '',
        name: locationType.name || '',
        isActive: locationType.isActive ?? true,
      });
    } else {
      reset({
        code: '',
        name: '',
        isActive: true,
      });
    }
  }, [locationType, reset]);

  const handleFormSubmit = async (data: LocationTypeFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit location type:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2">
        <LocationTypeInformationForm control={control} />
        
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
              {isLoading ? 'Saving...' : locationType ? 'Update Location Type' : 'Create Location Type'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
