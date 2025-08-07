"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/customers/use-customers";
import { RightDrawer } from "@/components/shared/right-drawer";
import { CustomerBasicInfoForm } from "./forms/customer-basic-info-form";
import { CustomerAddressForm } from "./forms/customer-address-form";
import { CustomerBankingDetailsForm } from "./forms/customer-banking-details-form";
import { CustomerBusinessTermsForm } from "./forms/customer-business-terms-form";
import { CustomerTaxComplianceForm } from "./forms/customer-tax-compliance-form";
import { Customer, CreateCustomerData, UpdateCustomerData } from "@/types/customer";
import { CustomerFormData, customerSchema } from "@/validations/customer";
import { getCustomerDefaultValues, mapCustomerToFormData, transformFormDataToApi } from "@/lib/utils/customer-utils";

interface CustomersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSuccess: () => void;
}

export default function CustomersDrawer({
  isOpen,
  onClose,
  customer,
  onSuccess,
}: CustomersDrawerProps) {
  const { toast } = useToast();
  
  // Main customer mutations
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: getCustomerDefaultValues(),
  });

  useEffect(() => {
    if (isOpen) {
      if (customer) {
        console.log('Loading customer data:', customer);
        const formData = mapCustomerToFormData(customer);
        console.log('Mapped form data:', formData);
        form.reset(formData);
      } else {
        console.log('Resetting to default values');
        form.reset(getCustomerDefaultValues());
      }
    }
  }, [customer, form, isOpen]);

  // Force re-render of child components when customer changes
  const [currentCustomerId, setCurrentCustomerId] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    setCurrentCustomerId(customer?.id);
  }, [customer?.id]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (customer) {
        // Update existing customer
        const updateData: UpdateCustomerData = {
          id: customer.id,
          ...transformFormDataToApi(data),
        };
        
        await updateCustomerMutation.mutateAsync(updateData);
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } else {
        // Create new customer
        const createData: CreateCustomerData = transformFormDataToApi(data);
        
        const newCustomer = await createCustomerMutation.mutateAsync(createData);
        toast({
          title: "Success",
          description: "Customer created successfully",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save customer",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isSubmitting = createCustomerMutation.isPending || updateCustomerMutation.isPending;

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={customer ? "Edit Customer" : "Create Customer"}
      description={customer ? "Update customer information" : "Add a new customer"}
      size="xl"
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="banking">Banking</TabsTrigger>
              <TabsTrigger value="business-terms">Business Terms</TabsTrigger>
              <TabsTrigger value="tax-compliance">Tax Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info" className="space-y-4">
              <CustomerBasicInfoForm />
            </TabsContent>

            <TabsContent value="addresses" className="space-y-4">
              <CustomerAddressForm customerId={currentCustomerId} />
            </TabsContent>

            <TabsContent value="banking" className="space-y-4">
              <CustomerBankingDetailsForm customerId={currentCustomerId} />
            </TabsContent>

            <TabsContent value="business-terms" className="space-y-4">
              <CustomerBusinessTermsForm customerId={currentCustomerId} />
            </TabsContent>

            <TabsContent value="tax-compliance" className="space-y-4">
              <CustomerTaxComplianceForm customerId={currentCustomerId} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
}
