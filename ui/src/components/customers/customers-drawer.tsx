"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RightDrawer } from "@/components/shared/right-drawer";
import { CustomerForm } from "./customer-form";
import { Customer, CreateCustomerData, UpdateCustomerData } from "@/types/customer";
import { CustomerFormValues, customerSchema, customerUpdateSchema } from "@/validations/customer";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/customers/use-customers";
import { useToast } from "@/hooks/use-toast";

interface CustomersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSuccess?: () => void;
}

export default function CustomersDrawer({
  isOpen,
  onClose,
  customer,
  onSuccess,
}: CustomersDrawerProps) {
  const { toast } = useToast();
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const isEditing = !!customer;
  const title = isEditing ? `Edit Customer - ${customer.customerName}` : "Add New Customer";

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(isEditing ? customerUpdateSchema : customerSchema),
    defaultValues: {
      locationCode: "",
      customerNumber: "",
      customerCode: "",
      customerName: "",
      shortName: "",
      payeeName: "",
      customerTypeCode: "",
      segmentCode: "",
      incomeTaxPanNumber: "",
      customerSaleType: "",
      exportType: "",
      gstin: "",
      drugLicenseNumber: "",
      drugLicenseExpiryDate: "",
      otherLicenseNumber: "",
      oldCode: "",
      customerLotNumber: "",
      stopInvoice: false,
      isExportCustomer: false,
      isRegisteredDealer: false,
      isRecordClosed: false,
      isActive: true,
      continent: "",
      rebates: "",
      externalInformation: "",
    },
  });

  useEffect(() => {
    if (customer && isOpen) {
      form.reset({
        locationCode: customer.locationCode || "",
        customerNumber: customer.customerNumber || "",
        customerCode: customer.customerCode || "",
        customerName: customer.customerName || "",
        shortName: customer.shortName || "",
        payeeName: customer.payeeName || "",
        customerTypeCode: customer.customerTypeCode || "",
        segmentCode: customer.segmentCode || "",
        incomeTaxPanNumber: customer.incomeTaxPanNumber || "",
        customerSaleType: customer.customerSaleType || "",
        exportType: customer.exportType || "",
        gstin: customer.gstin || "",
        drugLicenseNumber: customer.drugLicenseNumber || "",
        drugLicenseExpiryDate: customer.drugLicenseExpiryDate || "",
        otherLicenseNumber: customer.otherLicenseNumber || "",
        oldCode: customer.oldCode || "",
        customerLotNumber: customer.customerLotNumber || "",
        stopInvoice: customer.stopInvoice || false,
        isExportCustomer: customer.isExportCustomer || false,
        isRegisteredDealer: customer.isRegisteredDealer || false,
        isRecordClosed: customer.isRecordClosed || false,
        isActive: customer.isActive ?? true,
        continent: customer.continent || "",
        rebates: customer.rebates || "",
        externalInformation: customer.externalInformation || "",
      });
    } else if (!customer && isOpen) {
      form.reset({
        locationCode: "",
        customerNumber: "",
        customerCode: "",
        customerName: "",
        shortName: "",
        payeeName: "",
        customerTypeCode: "",
        segmentCode: "",
        incomeTaxPanNumber: "",
        customerSaleType: "",
        exportType: "",
        gstin: "",
        drugLicenseNumber: "",
        drugLicenseExpiryDate: "",
        otherLicenseNumber: "",
        oldCode: "",
        customerLotNumber: "",
        stopInvoice: false,
        isExportCustomer: false,
        isRegisteredDealer: false,
        isRecordClosed: false,
        isActive: true,
        continent: "",
        rebates: "",
        externalInformation: "",
      });
    }
  }, [customer, isOpen, form]);

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      if (isEditing && customer) {
        const updateData: UpdateCustomerData = {
          id: customer.id,
          ...values,
        };
        await updateCustomerMutation.mutateAsync({ id: customer.id.toString(), data: updateData });
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } else {
        const createData: CreateCustomerData = {
          ...values,
        };
        await createCustomerMutation.mutateAsync(createData);
        toast({
          title: "Success",
          description: "Customer created successfully",
        });
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save customer",
        variant: "destructive",
      });
    }
  };

  const isLoading = createCustomerMutation.isPending || updateCustomerMutation.isPending;

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title={title} size="full">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
          <div className="flex-1 overflow-auto p-6">
            <Tabs defaultValue="basic-info" className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
                <TabsTrigger value="licenses">Licenses & Compliance</TabsTrigger>
                <TabsTrigger value="settings">Settings & Preferences</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="basic-info" className="space-y-6">
                  <CustomerForm />
                </TabsContent>

                <TabsContent value="licenses" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Licenses & Compliance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        License and compliance information will be implemented here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings & Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Settings and preferences will be implemented here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="border-t p-6">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Update Customer" : "Create Customer"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
} 