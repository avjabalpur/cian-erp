"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCustomers, useDeleteCustomer } from "@/hooks/customers/use-customers";
import { useQueryState } from "nuqs";
import { customerFilterParsers } from "@/lib/utils/customer-utils";
import { CustomerFilter, Customer } from "@/types/customer";
import { useCustomerAddresses } from "@/hooks/customers/use-customer-addresses";
import { useCustomerBankingDetails } from "@/hooks/customers/use-customer-banking-details";
import { useCustomerBusinessTerms } from "@/hooks/customers/use-customer-business-terms";
import { useCustomerTaxCompliance } from "@/hooks/customers/use-customer-tax-compliance";
import CustomersFilter from "./customers-filter";
import CustomersTable from "./customers-table";
import CustomersDrawer from "./customers-drawer";

export default function CustomersManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const deleteCustomerMutation = useDeleteCustomer();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);

  // Hooks for fetching related data
  const { data: addressesData } = useCustomerAddresses(editingCustomerId || 0);
  const { data: bankingDetailsData } = useCustomerBankingDetails(editingCustomerId || 0);
  const { data: businessTermsData } = useCustomerBusinessTerms(editingCustomerId || 0);
  const { data: taxComplianceData } = useCustomerTaxCompliance(editingCustomerId || 0);

  // URL state management with nuqs
  const [page, setPage] = useQueryState("page", customerFilterParsers.pageNumber);
  const [pageSize, setPageSize] = useQueryState("pageSize", customerFilterParsers.pageSize);
  const [sortBy, setSortBy] = useQueryState("sortBy", customerFilterParsers.sortBy);
  const [sortDescending, setSortDescending] = useQueryState("sortDescending", customerFilterParsers.sortDescending);
  const [search] = useQueryState("search", customerFilterParsers.search);
  const [customerCode] = useQueryState("customerCode", customerFilterParsers.customerCode);
  const [customerName] = useQueryState("customerName", customerFilterParsers.customerName);
  const [isActive] = useQueryState("isActive", customerFilterParsers.isActive);

  const { data: customersData, isLoading, refetch } = useCustomers({
    page: (page as number) || 1,
    pageSize: (pageSize as number) || 20,
    search: search as string | undefined,
    customerCode: customerCode as string | undefined,
    customerName: customerName as string | undefined,
    isActive: isActive === true ? true : isActive === false ? false : undefined,
    sortBy: (sortBy as string) || "customerName",
    sortDescending: (sortDescending as boolean) || false
  });
  const customers = customersData?.items || [];
  const totalCount = customersData?.totalCount || 0;

  const handlePaginationChange = (pageIndex: number, newPageSize: number) => {
    setPage(pageIndex + 1); // Convert to 1-based indexing
    setPageSize(newPageSize);
  };

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setDrawerOpen(true);
  };

  // Effect to update the selected customer when related data is loaded
  useEffect(() => {
    if (editingCustomerId && selectedCustomer && selectedCustomer.id === editingCustomerId) {
      // Check if we already have the enhanced data to prevent infinite loops
      const hasEnhancedData = (selectedCustomer as any).addresses || (selectedCustomer as any).bankingDetails || (selectedCustomer as any).businessTerms || (selectedCustomer as any).taxCompliance;
      
      if (!hasEnhancedData) {
        const enhancedCustomer = {
          ...selectedCustomer,
          // Add addresses data
          addresses: addressesData || [],
          // Add banking details data
          bankingDetails: bankingDetailsData || [],
          // Add business terms data
          businessTerms: businessTermsData || [],
          // Add tax compliance data
          taxCompliance: taxComplianceData || [],
        } as Customer;
        
        setSelectedCustomer(enhancedCustomer);
      }
    }
  }, [editingCustomerId, selectedCustomer, addressesData, bankingDetailsData, businessTermsData, taxComplianceData]);

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditingCustomerId(customer.id);
    setDrawerOpen(true);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    try {
      await deleteCustomerMutation.mutateAsync(customer.id.toString());
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCustomer(null);
    setEditingCustomerId(null);
  };

  const handleDrawerSuccess = () => {
    refetch();
    handleDrawerClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Customers</h1>
        <Button onClick={handleCreateCustomer} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <CustomersFilter />
          <CustomersTable
            customers={customers}
            isLoading={isLoading}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            pagination={{
              pageIndex: ((page as number) || 1) - 1,
              pageSize: (pageSize as number) || 20,
              pageCount: Math.ceil(totalCount / ((pageSize as number) || 20)),
              totalCount,
            }}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>

      <CustomersDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        customer={selectedCustomer}
        onSuccess={handleDrawerSuccess}
      />
    </div>
  );
}
