'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { CustomerTypeForm } from './customer-type-form';
import { CustomerType } from '../types';
import { CustomerTypeFormValues } from '../validations';
import { toast } from 'sonner';
import { useCreateCustomerType, useUpdateCustomerType } from '../hooks';

interface CustomerTypeDrawerProps {
  customerType: CustomerType | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function CustomerTypeDrawer({ customerType, open, onOpenChange, mode }: CustomerTypeDrawerProps) {
  const createCustomerType = useCreateCustomerType();
  const updateCustomerType = useUpdateCustomerType();

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Customer Type';
      case 'edit':
        return 'Edit Customer Type';
      case 'view':
        return 'Customer Type Details';
      default:
        return 'Customer Type';
    }
  };

  const handleSubmit = async (data: CustomerTypeFormValues) => {
    try {
      const payload = {
        ...data,
        isExportType: data.isExportType ?? false,
        isDomesticType: data.isDomesticType ?? false,
        requiresDrugLicense: data.requiresDrugLicense ?? false,
        creditTermsApplicable: data.creditTermsApplicable ?? false,
        isActive: data.isActive ?? true,
      };

      if (customerType) {
        await updateCustomerType.mutateAsync({ id: customerType.id, data: payload });
        toast.success('Customer Type updated successfully');
      } else {
        await createCustomerType.mutateAsync(payload);
        toast.success('Customer Type created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(customerType ? 'Failed to update customer type' : 'Failed to create customer type');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="lg"
    >
      <CustomerTypeForm
        mode={mode}
        customerType={customerType}
        onSubmit={handleSubmit}
        isLoading={createCustomerType.isPending || updateCustomerType.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}

