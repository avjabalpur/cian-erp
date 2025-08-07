"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/customer-master/use-customer-master";
import { RightDrawer } from "@/components/shared/right-drawer";
import { CustomerBasicInfoForm } from "./forms/customer-basic-info-form";
import { CustomerAddressesForm } from "./forms/customer-addresses-form";
import { CustomerBankingForm } from "./forms/customer-banking-form";
import { CustomerBusinessTermsForm } from "./forms/customer-business-terms-form";
import { CustomerTaxComplianceForm } from "./forms/customer-tax-compliance-form";
import { Customer, CreateCustomerData, UpdateCustomerData } from "@/types/customer-master";
import { CustomerMasterFormData, customerMasterSchema } from "@/validations/customer-master";
import { getCustomerMasterDefaultValues, mapCustomerToFormData, transformFormDataToApi } from "@/lib/utils/customer-master-utils";

interface CustomerMasterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSuccess: () => void;
}

export function CustomerMasterDrawer({
  isOpen,
  onClose,
  customer,
  onSuccess,
}: CustomerMasterDrawerProps) {
  const { toast } = useToast();
  
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const form = useForm<CustomerMasterFormData>({
    resolver: zodResolver(customerMasterSchema),
    defaultValues: getCustomerMasterDefaultValues(),
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
        form.reset(getCustomerMasterDefaultValues());
      }
    }
  }, [customer, form, isOpen]);

  // Force re-render of child components when customer changes
  const [currentCustomerId, setCurrentCustomerId] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    setCurrentCustomerId(customer?.id);
  }, [customer?.id]);

  const onSubmit = async (data: CustomerMasterFormData) => {
    try {
      const apiData = transformFormDataToApi(data);
      
      if (customer) {
        await updateCustomerMutation.mutateAsync({
          id: customer.id,
          data: apiData as UpdateCustomerData,
        });
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } else {
        await createCustomerMutation.mutateAsync(apiData as CreateCustomerData);
        toast({
          title: "Success",
          description: "Customer created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Customer operation failed:', error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset(getCustomerMasterDefaultValues());
    onClose();
  };

  const isLoading = createCustomerMutation.isPending || updateCustomerMutation.isPending;

  return (
    <RightDrawer 
      isOpen={isOpen} 
      onClose={handleClose}
      title={customer ? "Edit Customer" : "Create New Customer"}
      description={customer 
        ? "Update the customer information below." 
        : "Fill in the information below to create a new customer."
      }
      size="5xl"
    >
      <div className="mx-auto w-full">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="banking">Banking</TabsTrigger>
                <TabsTrigger value="business">Business Terms</TabsTrigger>
                <TabsTrigger value="tax">Tax & Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-3">
                <CustomerBasicInfoForm control={form.control} />
              </TabsContent>

              <TabsContent value="addresses" className="space-y-3">
                <CustomerAddressesForm control={form.control} customerId={currentCustomerId} />
              </TabsContent>

              <TabsContent value="banking" className="space-y-3">
                <CustomerBankingForm control={form.control} customerId={currentCustomerId} />
              </TabsContent>

              <TabsContent value="business" className="space-y-3">
                <CustomerBusinessTermsForm control={form.control} customerId={currentCustomerId} />
              </TabsContent>

              <TabsContent value="tax" className="space-y-3">
                <CustomerTaxComplianceForm control={form.control} customerId={currentCustomerId} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </RightDrawer>
  );
} 