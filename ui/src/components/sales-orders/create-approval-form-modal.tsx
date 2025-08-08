"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/shared/forms/form-select";
import { salesOrderStatusOptions } from "@/lib/utils/sales-order-utils";
import { useCreateSalesOrder } from "@/hooks/sales-order/use-sales-orders";
import { useDosages } from "@/hooks/use-dosages";
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
  const createSalesOrderMutation = useCreateSalesOrder();
  
  // Fetch dosages from API
  const { data: dosagesData, isLoading: dosagesLoading } = useDosages({
    isActive: true,
    pageSize: 100 // Get all active dosages
  });

  const form = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalFormSchema),
    defaultValues: {
      dosageName: "",
      soStatus: "repeat",
    },
  });

  // Transform dosages data for the dropdown
  const dosageOptions = dosagesData?.items?.map(dosage => ({
    label: dosage.name,
    value: dosage.name,
  })) || [];

  // Set default dosage if available
  React.useEffect(() => {
    if (dosageOptions.length > 0 && !form.getValues("dosageName")) {
      form.setValue("dosageName", dosageOptions[0].value);
    }
  }, [dosageOptions, form]);

  const onSubmit = async (data: ApprovalFormData) => {
    try {
      // Create a basic sales order with the selected values
      const salesOrderData = {
        soNumber: `SO-${Date.now()}`, // Generate a temporary SO number
        soStatus: data.soStatus,
        dosageName: data.dosageName,
        isSubmitted: false,
        isDeleted: false,
        // Add other required fields with default values
        soDate: new Date().toISOString().split('T')[0],
        quantity: "0",
        mrp: "0",
        billingRate: "0",
        costing: "0",
        inventoryCharges: "0",
        cylinderCharge: "0",
        plateCharges: "0",
        domino: "DOMINO",
        stereo: "STEREO",
        packShort: "",
        composition: "",
        packingStyleDescription: "",
        tabletType: "",
        tabletSize: "",
        changePart: "",
        capsuleSize: "",
        shipperSize: "",
        qtyPerShipper: "0",
        noOfShipper: "0",
        flavour: "",
        fragrance: "",
        focQty: "0",
        shipperDrawingRefCode: "",
        ctnOuterDrawingRefNo: "",
        ctnInnerDrawingRefNo: "",
        foilDrawingRefNo: "",
        leafletDrawingRefNo: "",
        tubeDrawingRefNo: "",
        labelDrawingRefNo: "",
        pmOuterCtnStock: "0",
        pmInnerCtnStock: "0",
        pmFoilStock: "0",
        pmLeafletStock: "0",
        pmTubeStock: "0",
        pmLabelStock: "0",
        drugApprovalUnder: "",
        currentStatus: "new",
        comments: "",
        plantEmailSent: false,
      };

      const result = await createSalesOrderMutation.mutateAsync(salesOrderData);
      
      toast({
        title: "Success",
        description: "Sales order created successfully",
      });

      onClose();
      onSuccess(result.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create sales order",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = createSalesOrderMutation.isPending;

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
                disabled={dosagesLoading}
              />

              <FormSelect
                control={form.control}
                name="soStatus"
                label="SO Status"
                options={salesOrderStatusOptions.map(option => ({
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
              <Button type="submit" disabled={isLoading || dosagesLoading}>
                {isLoading ? "Creating..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
} 