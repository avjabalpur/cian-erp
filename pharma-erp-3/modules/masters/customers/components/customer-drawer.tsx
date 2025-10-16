'use client';

import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RightDrawer } from '@/components/shared/right-drawer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Customer } from '../types';
import { customerSchema, CustomerFormValues } from '../validations';
import { CustomerBasicInfoForm } from './forms/customer-basic-info-form';
import { CustomerAddressForm } from './forms/customer-address-form';
import { CustomerBankingDetailsForm } from './forms/customer-banking-details-form';
import { CustomerBusinessTermsForm } from './forms/customer-business-terms-form';
import { CustomerTaxComplianceForm } from './forms/customer-tax-compliance-form';

interface CustomerDrawerProps {
  customer: Customer | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CustomerFormValues) => Promise<void>;
  isLoading: boolean;
  mode: 'create' | 'edit' | 'view';
}

export function CustomerDrawer({ customer, open, onOpenChange, onSubmit, isLoading, mode }: CustomerDrawerProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      locationCode: '',
      customerNumber: '',
      customerCode: '',
      customerName: '',
      stopInvoice: false,
      isExportCustomer: false,
      isRegisteredDealer: false,
      isRecordClosed: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (customer && open) {
      form.reset({
        locationCode: customer.locationCode,
        customerNumber: customer.customerNumber,
        customerCode: customer.customerCode,
        customerName: customer.customerName,
        shortName: customer.shortName,
        payeeName: customer.payeeName,
        customerTypeCode: customer.customerTypeCode,
        segmentCode: customer.segmentCode,
        incomeTaxPanNumber: customer.incomeTaxPanNumber,
        customerSaleType: customer.customerSaleType,
        exportType: customer.exportType,
        gstin: customer.gstin,
        drugLicenseNumber: customer.drugLicenseNumber,
        drugLicenseExpiryDate: customer.drugLicenseExpiryDate,
        otherLicenseNumber: customer.otherLicenseNumber,
        oldCode: customer.oldCode,
        customerLotNumber: customer.customerLotNumber,
        stopInvoice: customer.stopInvoice,
        isExportCustomer: customer.isExportCustomer,
        isRegisteredDealer: customer.isRegisteredDealer,
        isRecordClosed: customer.isRecordClosed,
        isActive: customer.isActive,
        continent: customer.continent,
        rebates: customer.rebates,
        externalInformation: customer.externalInformation,
      });
    } else if (!customer && open) {
      form.reset();
    }
  }, [customer, open, form]);

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Customer';
      case 'edit':
        return 'Edit Customer';
      case 'view':
        return 'Customer Details';
      default:
        return 'Customer';
    }
  };

  const handleSubmit = async (data: CustomerFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  const onError = (errors: any) => {
    console.log('❌ Form validation errors:', errors);
    console.log('📋 Current form values:', form.getValues());
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="full"
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="space-y-4 p-0">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="banking">Banking</TabsTrigger>
              <TabsTrigger value="business">Business Terms</TabsTrigger>
              <TabsTrigger value="tax">Tax Compliance</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="basic" className="space-y-4">
                <CustomerBasicInfoForm control={form.control} customerId={customer?.id} />
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <CustomerAddressForm control={form.control} customerId={customer?.id} />
              </TabsContent>

              <TabsContent value="banking" className="space-y-4">
                <CustomerBankingDetailsForm control={form.control} customerId={customer?.id} />
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <CustomerBusinessTermsForm control={form.control} customerId={customer?.id} />
              </TabsContent>

              <TabsContent value="tax" className="space-y-4">
                <CustomerTaxComplianceForm control={form.control} customerId={customer?.id} />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            {mode !== 'view' && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : customer ? 'Update Customer' : 'Create Customer'}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
}

