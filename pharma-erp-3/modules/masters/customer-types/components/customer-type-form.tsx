'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { customerTypeSchema, CustomerTypeFormValues } from '../validations';
import { CustomerTypeInformationForm } from './customer-type-information-form';
import { CustomerType } from '../types';
import { useEffect } from 'react';

interface CustomerTypeFormProps {
  mode: 'create' | 'edit' | 'view';
  customerType?: CustomerType;
  onSubmit: (data: CustomerTypeFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function CustomerTypeForm({ mode, customerType, onSubmit, isLoading, onCancel }: CustomerTypeFormProps) {
  const form = useForm<CustomerTypeFormValues>({
    resolver: zodResolver(customerTypeSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      isExportType: false,
      isDomesticType: false,
      requiresDrugLicense: false,
      creditTermsApplicable: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (customerType) {
      form.reset({
        code: customerType.code,
        name: customerType.name,
        description: customerType.description || '',
        isExportType: customerType.isExportType,
        isDomesticType: customerType.isDomesticType,
        requiresDrugLicense: customerType.requiresDrugLicense,
        creditTermsApplicable: customerType.creditTermsApplicable,
        isActive: customerType.isActive,
      });
    }
  }, [customerType, form]);

  const handleSubmit = (data: CustomerTypeFormValues) => {
    onSubmit(data);
  };

  const isViewMode = mode === 'view';

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CustomerTypeInformationForm control={form.control} />
        
        {!isViewMode && (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : customerType ? 'Update' : 'Create'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

