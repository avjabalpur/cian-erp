'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Organization } from '../types';
import { organizationFormSchema, OrganizationFormValues } from '../validations';
import { OrganizationInformationForm } from './organization-information-form';

interface OrganizationFormProps {
  organization?: Organization | null;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: OrganizationFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function OrganizationForm({ organization, mode, onSubmit, onCancel, isLoading }: OrganizationFormProps) {
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      code: organization?.code || '',
      name: organization?.name || '',
      locationTypeId: organization?.locationTypeId || 1,
      contactPerson: organization?.contactPerson || '',
      address1: organization?.address1 || '',
      address2: organization?.address2 || '',
      city: organization?.city || '',
      state: organization?.state || '',
      country: organization?.country || '',
      zip: organization?.zip || '',
      phone: organization?.phone || '',
      email: organization?.email || '',
      website: organization?.website || '',
      gstinNumber: organization?.gstinNumber || '',
      tdsCycle: organization?.tdsCycle || '',
      employmentStatusCode: organization?.employmentStatusCode || '',
      esiOfficeCode: organization?.esiOfficeCode || '',
      cinNumber: organization?.cinNumber || '',
      licenseNumber: organization?.licenseNumber || '',
      drugLicenseNumber1: organization?.drugLicenseNumber1 || '',
      drugLicenseNumber2: organization?.drugLicenseNumber2 || '',
      foodLicenseNumber: organization?.foodLicenseNumber || '',
      cstRegnNumber: organization?.cstRegnNumber || '',
      vatTinNumber: organization?.vatTinNumber || '',
      panNumber: organization?.panNumber || '',
      isActive: organization?.isActive ?? true,
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (organization) {
      reset({
        code: organization.code || '',
        name: organization.name || '',
        locationTypeId: organization.locationTypeId || 1,
        contactPerson: organization.contactPerson || '',
        address1: organization.address1 || '',
        address2: organization.address2 || '',
        city: organization.city || '',
        state: organization.state || '',
        country: organization.country || '',
        zip: organization.zip || '',
        phone: organization.phone || '',
        email: organization.email || '',
        website: organization.website || '',
        gstinNumber: organization.gstinNumber || '',
        tdsCycle: organization.tdsCycle || '',
        employmentStatusCode: organization.employmentStatusCode || '',
        esiOfficeCode: organization.esiOfficeCode || '',
        cinNumber: organization.cinNumber || '',
        licenseNumber: organization.licenseNumber || '',
        drugLicenseNumber1: organization.drugLicenseNumber1 || '',
        drugLicenseNumber2: organization.drugLicenseNumber2 || '',
        foodLicenseNumber: organization.foodLicenseNumber || '',
        cstRegnNumber: organization.cstRegnNumber || '',
        vatTinNumber: organization.vatTinNumber || '',
        panNumber: organization.panNumber || '',
        isActive: organization.isActive ?? true,
      });
    }
  }, [organization, reset]);

  const handleFormSubmit = async (data: OrganizationFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit organization:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <OrganizationInformationForm control={control} />
        
        {mode !== 'view' && (
          <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background py-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : organization ? 'Update Organization' : 'Create Organization'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
