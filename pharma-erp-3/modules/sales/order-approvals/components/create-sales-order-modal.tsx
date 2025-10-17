'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { FormSelect } from '@/components/shared/forms/form-select';
import { useDosages } from '@/modules/masters/dosages/hooks';
import { toast } from 'sonner';
import { useCreateSalesOrderApproval } from '../hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const createSalesOrderSchema = z.object({
  dosageName: z.string().min(1, 'Dosage is required'),
  soStatus: z.string().min(1, 'SO status is required'),
});

type CreateSalesOrderFormData = z.infer<typeof createSalesOrderSchema>;

interface CreateSalesOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (salesOrderId: number) => void;
}

export function CreateSalesOrderModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateSalesOrderModalProps) {
  const createSalesOrderApproval = useCreateSalesOrderApproval();
  const { data: dosagesData } = useDosages();
  const dosages = dosagesData?.items || [];

  const dosageOptions = [
    { label: 'Select Dosage', value: '0' },
    ...dosages.map(d => ({ label: d.name, value: d.name }))
  ];

  const soStatusOptions = [
    { label: 'Select SO Status', value: '0' },
    { label: 'Repeat', value: 'REPEAT' },
    { label: 'New', value: 'NEW' },
    { label: 'Modification', value: 'MODIFICATION' },
  ];

  const form = useForm<CreateSalesOrderFormData>({
    resolver: zodResolver(createSalesOrderSchema),
    defaultValues: {
      dosageName: '',
      soStatus: '',
    },
  });

  const onSubmit = async (data: CreateSalesOrderFormData) => {
    try {
      // Generate SO Number (simplified for now)
      const soNumber = `SO-${Date.now()}`;
      
      const result = await createSalesOrder.mutateAsync({
        soNumber,
        soStatus: data.soStatus,
        // Add other minimal required fields
      });

      toast.success('Sales order created successfully');
      form.reset();
      onOpenChange(false);
      onSuccess(result.id);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create sales order');
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Sales Order Approval</DialogTitle>
          <DialogDescription>
            Select the dosage and SO status to create a new sales order.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormSelect
              control={form.control}
              name="dosageName"
              label="Dosage"
              options={dosageOptions}
              placeholder="Select dosage"
              required
            />
            <FormSelect
              control={form.control}
              name="soStatus"
              label="SO Status"
              options={soStatusOptions}
              placeholder="Select SO status"
              required
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={createSalesOrder.isPending}>
                {createSalesOrder.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

