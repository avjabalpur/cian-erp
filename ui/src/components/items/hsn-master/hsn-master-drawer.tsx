"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCreateHsnMaster, useUpdateHsnMaster } from "@/hooks/items/use-hsn-master";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormTextarea } from "@/components/shared/forms/form-textarea";
import { FormSelect } from "@/components/shared/forms/form-select";
import { RightDrawer } from "@/components/shared/right-drawer";
import { HsnMasterFormData, hsnMasterSchema } from "@/validations/item-master";
import { HsnMaster } from "@/types/hsn-master";

interface HsnMasterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hsnMaster?: HsnMaster | null;
  onSuccess: () => void;
}

export default function HsnMasterDrawer({
  isOpen,
  onClose,
  hsnMaster,
  onSuccess,
}: HsnMasterDrawerProps) {
  const { toast } = useToast();
  const createHsnMasterMutation = useCreateHsnMaster();
  const updateHsnMasterMutation = useUpdateHsnMaster();

  const form = useForm<HsnMasterFormData>({
    resolver: zodResolver(hsnMasterSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      hsnType: "",
      uqc: "",
      igstRate: undefined,
      cgstRate: undefined,
      sgstRate: undefined,
      cessRate: undefined,
      isReverseCharges: false,
      isActive: true,
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = form;

  useEffect(() => {
    if (hsnMaster) {
      console.log('Setting form values for edit:', hsnMaster);
      reset({
        code: hsnMaster.code || "",
        name: hsnMaster.name || "",
        description: hsnMaster.description || "",
        hsnType: hsnMaster.hsnType || "",
        uqc: hsnMaster.uqc || "",
        igstRate: hsnMaster.igstRate || undefined,
        cgstRate: hsnMaster.cgstRate || undefined,
        sgstRate: hsnMaster.sgstRate || undefined,
        cessRate: hsnMaster.cessRate || undefined,
        isReverseCharges: hsnMaster.isReverseCharges ?? false,
        isActive: hsnMaster.isActive ?? true,
      });
    } else {
      console.log('Setting form values for create');
      reset({
        code: "",
        name: "",
        description: "",
        hsnType: "",
        uqc: "",
        igstRate: undefined,
        cgstRate: undefined,
        sgstRate: undefined,
        cessRate: undefined,
        isReverseCharges: false,
        isActive: true,
      });
    }
  }, [hsnMaster, reset]);

  const onSubmit = async (data: HsnMasterFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Current hsnMaster:', hsnMaster);
    
    try {
      const payload = {
        code: data.code,
        name: data.name,
        description: data.description,
        hsnType: data.hsnType,
        uqc: data.uqc,
        igstRate: data.igstRate,
        cgstRate: data.cgstRate,
        sgstRate: data.sgstRate,
        cessRate: data.cessRate,
        isReverseCharges: data.isReverseCharges,
        isActive: data.isActive,
      };

      console.log('Payload to be sent:', payload);

      if (hsnMaster) {
        console.log('Updating HSN master with ID:', hsnMaster.id);
        const result = await updateHsnMasterMutation.mutateAsync({
          id: hsnMaster.id,
          data: payload,
        });
        console.log('Update result:', result);
        toast({
          title: "Success",
          description: "HSN master updated successfully",
        });
      } else {
        console.log('Creating new HSN master');
        const result = await createHsnMasterMutation.mutateAsync(payload);
        console.log('Create result:', result);
        toast({
          title: "Success",
          description: "HSN master created successfully",
        });
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('HSN master operation failed:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data
      });
      
      // Handle specific error cases
      let errorMessage = hsnMaster 
        ? "Failed to update HSN master" 
        : "Failed to create HSN master";
      
      if (error?.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error?.response?.status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isLoading = createHsnMasterMutation.isPending || updateHsnMasterMutation.isPending;

  // Debug form state
  console.log('Form errors:', errors);
  console.log('Form isSubmitting:', isSubmitting);
  console.log('Mutation states:', {
    createPending: createHsnMasterMutation.isPending,
    updatePending: updateHsnMasterMutation.isPending,
    isLoading
  });

  const hsnTypeOptions = [
    { value: "H", label: "H" },
    { value: "S", label: "S" },
  ];

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={hsnMaster ? "Edit HSN Master" : "Create New HSN Master"}
      size="xl"
      description={hsnMaster 
        ? "Update the HSN master information below." 
        : "Fill in the information below to create a new HSN master."
      }
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="code"
              label="Code"
              placeholder="Enter HSN code (e.g., 3004)"
              required
            />

            <FormInput
              control={control}
              name="name"
              label="Name"
              placeholder="Enter HSN name"
              required
            />
          </div>

          <FormTextarea
            control={control}
            name="description"
            label="Description"
            placeholder="Enter description"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={control}
              name="hsnType"
              label="HSN Type"
              placeholder="Select HSN type (optional)"
              options={hsnTypeOptions}
            />

            <FormInput
              control={control}
              name="uqc"
              label="UQC"
              placeholder="Enter UQC"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="igstRate"
              label="IGST Rate (%)"
              placeholder="Enter IGST rate"
              inputProps={{ 
                type: "number",
                min: "0",
                max: "100",
                step: "0.01"
              }}
            />

            <FormInput
              control={control}
              name="cgstRate"
              label="CGST Rate (%)"
              placeholder="Enter CGST rate"
              inputProps={{ 
                type: "number",
                min: "0",
                max: "100",
                step: "0.01"
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="sgstRate"
              label="SGST Rate (%)"
              placeholder="Enter SGST rate"
              inputProps={{ 
                type: "number",
                min: "0",
                max: "100",
                step: "0.01"
              }}
            />

            <FormInput
              control={control}
              name="cessRate"
              label="CESS Rate (%)"
              placeholder="Enter CESS rate"
              inputProps={{ 
                type: "number",
                min: "0",
                max: "100",
                step: "0.01"
              }}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Reverse Charges</label>
              <p className="text-sm text-muted-foreground">
                Enable reverse charges for this HSN code
              </p>
            </div>
            <Switch
              checked={form.watch("isReverseCharges")}
              onCheckedChange={(checked) => form.setValue("isReverseCharges", checked)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Active Status</label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this HSN master
              </p>
            </div>
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "Saving..." : hsnMaster ? "Update HSN Master" : "Create HSN Master"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
} 