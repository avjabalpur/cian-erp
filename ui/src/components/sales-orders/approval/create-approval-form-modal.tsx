"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/shared/forms/form-select";
import { soStatusOptions } from "@/lib/utils/sales-order-utils";
import { useCreateSalesOrderApproval } from "@/hooks/sales-order/use-sales-orders";
import { useDosageOptions } from "@/components/shared/options";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

// Validation schema for the approval form
const approvalFormSchema = z.object({
  dosageName: z.string().min(1, "Dosage name is required"),
  soStatus: z.string().min(1, "SO status is required"),
});

type ApprovalFormData = z.infer<typeof approvalFormSchema>;

interface CreateApprovalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (salesOrderId: number) => void;
}

export function CreateApprovalFormModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateApprovalFormModalProps) {
  const { toast } = useToast();
  const createSalesOrderApprovalMutation = useCreateSalesOrderApproval();
  
  // Get dosage options using the new hook
  const dosageOptions = useDosageOptions();

  const form = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalFormSchema),
    defaultValues: {
      dosageName: "",
      soStatus: "repeat",
    },
  });

  // Set default dosage if available
  React.useEffect(() => {
    if (dosageOptions.length > 1 && !form.getValues("dosageName")) {
      // Skip the first option (default "Select dosage") and use the second one
      form.setValue("dosageName", dosageOptions[1].value);
    }
  }, [dosageOptions, form]);

  const onSubmit = async (data: ApprovalFormData) => {
    try {
      const result = await createSalesOrderApprovalMutation.mutateAsync({
        soStatus: data.soStatus,
        dosageName: data.dosageName
      });
      
      toast({
        title: "Success",
        description: "Sales order approval created successfully",
      });

      onClose();
      onSuccess(result.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create sales order approval",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = createSalesOrderApprovalMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Approval Form</DialogTitle>
          <DialogDescription>
            Select the dosage name and SO status to create a new sales order.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
                             <FormSelect
                 control={form.control}
                 name="dosageName"
                 label="Dosage Name"
                 options={dosageOptions}
                 required
               />

              <FormSelect
                control={form.control}
                name="soStatus"
                label="SO Status"
                options={soStatusOptions.map(option => ({
                  label: option.label,
                  value: option.value,
                }))}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
} 