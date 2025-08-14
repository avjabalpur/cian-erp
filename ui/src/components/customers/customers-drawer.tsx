"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/customers/use-customers";
import { useCreateCustomerAddress, useUpdateCustomerAddress } from "@/hooks/customers/use-customer-addresses";
import { useCreateCustomerBankingDetail, useUpdateCustomerBankingDetail } from "@/hooks/customers/use-customer-banking-details";
import { useCreateCustomerBusinessTerm, useUpdateCustomerBusinessTerm } from "@/hooks/customers/use-customer-business-terms";
import { useCreateCustomerTaxCompliance, useUpdateCustomerTaxCompliance } from "@/hooks/customers/use-customer-tax-compliance";
import { RightDrawer } from "@/components/shared/right-drawer";
import { CustomerBasicInfoForm } from "./forms/customer-basic-info-form";
import { Customer, CreateCustomerData, UpdateCustomerData } from "@/types/customer";
import { CustomerFormData, customerSchema } from "@/validations/customer";
import { getCustomerDefaultValues, mapCustomerToFormData, transformFormDataToApi } from "@/lib/utils/customer-utils";
import { CustomerAddressForm } from "./forms/customer-address-form";
import { CustomerBankingDetailsForm } from "./forms/customer-banking-details-form";
import { CustomerBusinessTermsForm } from "./forms/customer-business-terms-form";
import { CustomerTaxComplianceForm } from "./forms/customer-tax-compliance-form";

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
  
  // Related data mutations
  const createAddressMutation = useCreateCustomerAddress();
  const updateAddressMutation = useUpdateCustomerAddress();
  
  const createBankingDetailMutation = useCreateCustomerBankingDetail();
  const updateBankingDetailMutation = useUpdateCustomerBankingDetail();
  
  const createBusinessTermsMutation = useCreateCustomerBusinessTerm();
  const updateBusinessTermsMutation = useUpdateCustomerBusinessTerm();
  
  const createTaxComplianceMutation = useCreateCustomerTaxCompliance();
  const updateTaxComplianceMutation = useUpdateCustomerTaxCompliance();

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

  const saveRelatedData = async (customerId: number, formData: CustomerFormData) => {
    const promises = [];

    // Save address if provided
    if (formData.addresses && formData.addresses.length > 0) {
      const addressData = {
        customerId,
        addressLine1: formData.addresses[0].addressLine1,
        addressLine2: formData.addresses[0].addressLine2,
        addressLine3: formData.addresses[0].addressLine3,
        city: formData.addresses[0].city,
        zipCode: formData.addresses[0].zipCode,
        country: formData.addresses[0].country,
        stateCode: formData.addresses[0].stateCode,
        gstStateCode: formData.addresses[0].gstStateCode,
        contactPerson: formData.addresses[0].contactPerson,
        telephoneNumber: formData.addresses[0].telephoneNumber,
        mobileNumber: formData.addresses[0].mobileNumber,
        faxNumber: formData.addresses[0].faxNumber,
        emailId: formData.addresses[0].emailId,
        website: formData.addresses[0].website,
        isPrimary: formData.addresses[0].isPrimary ?? true,
      };
      
      if (customer?.addresses && customer.addresses.length > 0) {
        promises.push(updateAddressMutation.mutateAsync({ 
          customerId, 
          addressId: customer.addresses[0].id, 
          data: { ...addressData, id: customer.addresses[0].id } 
        }));
      } else {
        promises.push(createAddressMutation.mutateAsync({ customerId, data: addressData }));
      }
    }

    // Save banking details if provided
    if (formData.bankingDetails && formData.bankingDetails.length > 0) {
      const bankingData = {
        customerId,
        bankIfscCode: formData.bankingDetails[0].bankIfscCode,
        bankAccountNumber: formData.bankingDetails[0].bankAccountNumber,
        bankName: formData.bankingDetails[0].bankName,
        customerBanker: formData.bankingDetails[0].customerBanker,
        customerVpa: formData.bankingDetails[0].customerVpa,
        bankAccountTypeCode: formData.bankingDetails[0].bankAccountTypeCode,
        bankBranch: formData.bankingDetails[0].bankBranch,
        bankLocation: formData.bankingDetails[0].bankLocation,
        isPrimary: formData.bankingDetails[0].isPrimary ?? true,
      };
      
      if (customer?.bankingDetails && customer.bankingDetails.length > 0) {
        promises.push(updateBankingDetailMutation.mutateAsync({ 
          customerId, 
          bankingDetailId: customer.bankingDetails[0].id, 
          data: { ...bankingData, id: customer.bankingDetails[0].id } 
        }));
      } else {
        promises.push(createBankingDetailMutation.mutateAsync({ customerId, data: bankingData }));
      }
    }

    // Save business terms if provided
    if (formData.businessTerms && formData.businessTerms.length > 0) {
      const businessTermsData = {
        customerId,
        destinationCode: formData.businessTerms[0].destinationCode,
        transportModeCode: formData.businessTerms[0].transportModeCode,
        transporterCode: formData.businessTerms[0].transporterCode,
        leadDays: formData.businessTerms[0].leadDays,
        customerDistance: formData.businessTerms[0].customerDistance,
        freightIndicator: formData.businessTerms[0].freightIndicator,
        supplyStockLocation: formData.businessTerms[0].supplyStockLocation,
        allowConsignmentOnBooking: formData.businessTerms[0].allowConsignmentOnBooking ?? false,
        customerAccountCode: formData.businessTerms[0].customerAccountCode,
        creditLimit: formData.businessTerms[0].creditLimit,
        minimumInvoiceAmount: formData.businessTerms[0].minimumInvoiceAmount,
        customerSchemeCode: formData.businessTerms[0].customerSchemeCode,
        customerBrokerCode: formData.businessTerms[0].customerBrokerCode,
        customerBrokerRate: formData.businessTerms[0].customerBrokerRate,
        cashDiscountPercentage: formData.businessTerms[0].cashDiscountPercentage,
        miscChargePercentage: formData.businessTerms[0].miscChargePercentage,
        miscDiscountPercentage: formData.businessTerms[0].miscDiscountPercentage,
        paymentTermCode: formData.businessTerms[0].paymentTermCode,
        creditPeriodDays: formData.businessTerms[0].creditPeriodDays,
        newPartyCreditPeriodDays: formData.businessTerms[0].newPartyCreditPeriodDays,
        isOverdueCheck: formData.businessTerms[0].isOverdueCheck ?? false,
        numberOfBills: formData.businessTerms[0].numberOfBills,
        outstandingBillPeriodDays: formData.businessTerms[0].outstandingBillPeriodDays,
        outstandingBillAccountIndicator: formData.businessTerms[0].outstandingBillAccountIndicator,
      };
      
      if (customer?.businessTerms && customer.businessTerms.length > 0) {
        promises.push(updateBusinessTermsMutation.mutateAsync({ 
          customerId, 
          businessTermId: customer.businessTerms[0].id, 
          data: { ...businessTermsData, id: customer.businessTerms[0].id } 
        }));
      } else {
        promises.push(createBusinessTermsMutation.mutateAsync({ customerId, data: businessTermsData }));
      }
    }

    // Save tax compliance if provided
    if (formData.taxCompliance && formData.taxCompliance.length > 0) {
      const taxComplianceData = {
        customerId,
        vatFormCode: formData.taxCompliance[0].vatFormCode,
        centralFormCode: formData.taxCompliance[0].centralFormCode,
        isEligibleForTcs: formData.taxCompliance[0].isEligibleForTcs ?? false,
        tcsType: formData.taxCompliance[0].tcsType,
        isApplicableHigherRate: formData.taxCompliance[0].isApplicableHigherRate ?? false,
        isDeemedNonResident: formData.taxCompliance[0].isDeemedNonResident ?? false,
        isDeemedPermanentEstablishment: formData.taxCompliance[0].isDeemedPermanentEstablishment ?? false,
        isBillDiscount: formData.taxCompliance[0].isBillDiscount ?? false,
        isReverseEndOfYear: formData.taxCompliance[0].isReverseEndOfYear ?? false,
        customerInterfaceCode: formData.taxCompliance[0].customerInterfaceCode,
        interfaceFileFormat: formData.taxCompliance[0].interfaceFileFormat,
        projectionRatio: formData.taxCompliance[0].projectionRatio,
        numberOfDisplays: formData.taxCompliance[0].numberOfDisplays,
        labelLayout: formData.taxCompliance[0].labelLayout,
        numberOfCopies: formData.taxCompliance[0].numberOfCopies,
        specialTerms: formData.taxCompliance[0].specialTerms,
        documentsThrough: formData.taxCompliance[0].documentsThrough,
      };
      
      if (customer?.taxCompliance && customer.taxCompliance.length > 0) {
        promises.push(updateTaxComplianceMutation.mutateAsync({ 
          customerId, 
          taxComplianceId: customer.taxCompliance[0].id, 
          data: { ...taxComplianceData, id: customer.taxCompliance[0].id } 
        }));
      } else {
        promises.push(createTaxComplianceMutation.mutateAsync({ customerId, data: taxComplianceData }));
      }
    }

    // Execute all promises
    if (promises.length > 0) {
      await Promise.all(promises);
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    try {
      console.log('Form data before transformation:', data);
      const transformedData = transformFormDataToApi(data);
      console.log('Transformed data:', transformedData);

      let createdCustomerId: number = 0;
debugger;
      if (customer) {
        const result = await updateCustomerMutation.mutateAsync({
          id: customer.id.toString(),
          data: transformedData as unknown as UpdateCustomerData,
        });
        if (result) {
          createdCustomerId = customer.id;
          toast({
            title: "Success",
            description: "Customer updated successfully",
          });
        }
      } else {
        const result = await createCustomerMutation.mutateAsync(transformedData as unknown as CreateCustomerData);
        if (result) {
          createdCustomerId = result.id;
          toast({
            title: "Success",
            description: "Customer created successfully",
          });
        }
      }

      // Save related data
      if (createdCustomerId > 0) {
        try {
          await saveRelatedData(createdCustomerId, data);
          toast({
            title: "Success",
            description: "Customer and related data saved successfully",
          });
        } catch (relatedDataError: any) {
          console.error('Related data save error:', relatedDataError);
          toast({
            title: "Warning",
            description: "Customer saved but some related data could not be saved. Please check the details.",
            variant: "destructive",
          });
        }
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
    form.reset(getCustomerDefaultValues());
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
      size="full"
    >
      <div className="mx-auto w-full">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="basic-info" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="banking">Banking</TabsTrigger>
                <TabsTrigger value="business-terms">Business Terms</TabsTrigger>
                <TabsTrigger value="tax-compliance">Tax Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="space-y-3">
                <CustomerBasicInfoForm control={form.control} customerId={currentCustomerId} />
              </TabsContent>

              <TabsContent value="addresses" className="space-y-3">
                <CustomerAddressForm control={form.control} customerId={currentCustomerId} />
              </TabsContent>

              <TabsContent value="banking" className="space-y-3">
                <CustomerBankingDetailsForm control={form.control} customerId={currentCustomerId} />
              </TabsContent>

              <TabsContent value="business-terms" className="space-y-3">
                <CustomerBusinessTermsForm control={form.control} customerId={currentCustomerId} />
              </TabsContent>

              <TabsContent value="tax-compliance" className="space-y-3">
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
