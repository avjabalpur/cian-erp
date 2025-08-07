"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateCustomerType, useUpdateCustomerType } from "@/hooks/customers/use-customer-types";
import { RightDrawer } from "@/components/shared/right-drawer";
import { CustomerType, CreateCustomerTypeData, UpdateCustomerTypeData } from "@/types/customer-type";
import { customerTypeSchema, CustomerTypeFormData } from "@/validations/customer-type";
import { getCustomerTypeDefaultValues, mapCustomerTypeToFormData, transformFormDataToApi } from "@/lib/utils/customer-type-utils";
import { CustomerTypeForm } from "./forms/customer-type-form";

interface CustomerTypesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customerType?: CustomerType | null;
  onSuccess: () => void;
}

export default function CustomerTypesDrawer({
  isOpen,
  onClose,
  customerType,
  onSuccess,
}: CustomerTypesDrawerProps) {
  const { toast } = useToast();
  
  const createCustomerTypeMutation = useCreateCustomerType();
  const updateCustomerTypeMutation = useUpdateCustomerType();

  const form = useForm<CustomerTypeFormData>({
    resolver: zodResolver(customerTypeSchema),
    defaultValues: getCustomerTypeDefaultValues(),
  });

  useEffect(() => {
    if (isOpen) {
      if (customerType) {
        console.log('Loading customer type data:', customerType);
        const formData = mapCustomerTypeToFormData(customerType);
        console.log('Mapped form data:', formData);
        form.reset(formData);
      } else {
        console.log('Resetting to default values');
        form.reset(getCustomerTypeDefaultValues());
      }
    }
  }, [customerType, form, isOpen]);

  const onSubmit = async (data: CustomerTypeFormData) => {
    try {
      if (customerType) {
        // Update existing customer type
        const updateData: UpdateCustomerTypeData = {
          ...transformFormDataToApi(data),
        };
        
        await updateCustomerTypeMutation.mutateAsync({ id: customerType.id.toString(), ...updateData });
        toast({
          title: "Success",
          description: "Customer type updated successfully",
        });
      } else {
        // Create new customer type
        const createData: CreateCustomerTypeData = transformFormDataToApi(data);
        
        await createCustomerTypeMutation.mutateAsync(createData);
        toast({
          title: "Success",
          description: "Customer type created successfully",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving customer type:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save customer type",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isSubmitting = createCustomerTypeMutation.isPending || updateCustomerTypeMutation.isPending;

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={customerType ? "Edit Customer Type" : "Create Customer Type"}
      description={customerType ? "Update customer type information" : "Add a new customer type"}
      size="lg"
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomerTypeForm />

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : customerType ? "Update Customer Type" : "Create Customer Type"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
}
