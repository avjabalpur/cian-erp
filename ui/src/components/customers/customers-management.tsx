"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCustomers, useDeleteCustomer } from "@/hooks/customers/use-customers";
import { useQueryState } from "nuqs";
import { customerFilterParsers } from "@/lib/utils/customer-utils";
import CustomersTable from "./customers-table";
import CustomersFilter from "./customers-filter";
import CustomersDrawer from "./customers-drawer";
import { Customer, CustomerFilter } from "@/types/customer";

export default function CustomersManagement() {
  const { toast } = useToast();
  const deleteCustomerMutation = useDeleteCustomer();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // URL state management with nuqs
  const [page, setPage] = useQueryState("page", customerFilterParsers.pageNumber);
  const [pageSize, setPageSize] = useQueryState("pageSize", customerFilterParsers.pageSize);
  const [search, setSearch] = useQueryState("search", customerFilterParsers.search);
  const [customerCode, setCustomerCode] = useQueryState("customerCode", customerFilterParsers.customerCode);
  const [customerName, setCustomerName] = useQueryState("customerName", customerFilterParsers.customerName);
  const [customerTypeCode, setCustomerTypeCode] = useQueryState("customerTypeCode", customerFilterParsers.customerTypeCode);
  const [gstin, setGstin] = useQueryState("gstin", customerFilterParsers.gstin);
  const [isActive, setIsActive] = useQueryState("isActive", customerFilterParsers.isActive);
  const [isExportCustomer, setIsExportCustomer] = useQueryState("isExportCustomer", customerFilterParsers.isExportCustomer);
  const [sortBy, setSortBy] = useQueryState("sortBy", customerFilterParsers.sortBy);
  const [sortDescending, setSortDescending] = useQueryState("sortDescending", customerFilterParsers.sortDescending);

  // Construct filter object for API
  const filter: CustomerFilter = {
    page: page || 1,
    pageSize: pageSize || 20,
    search: search || undefined,
    customerCode: customerCode || undefined,
    customerName: customerName || undefined,
    customerTypeCode: customerTypeCode || undefined,
    gstin: gstin || undefined,
    isActive: isActive || undefined,
    isExportCustomer: isExportCustomer || undefined,
    sortBy: sortBy || 'customerName',
    sortDescending: sortDescending || false,
  };

  const { data: customersData, isLoading, refetch } = useCustomers(filter);
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

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      await deleteCustomerMutation.mutateAsync(customer.id.toString());
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
      refetch();
    } catch (error: any) {
      console.error('Delete customer failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customer Management</h1>
        </div>
        <Button onClick={handleCreateCustomer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <CustomersFilter />

      <CustomersTable
        customers={customers}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        onView={handleViewCustomer}
        isLoading={isLoading}
        pageCount={Math.ceil(totalCount / (pageSize || 20))}
        pageSize={pageSize || 20}
        pageIndex={(page || 1) - 1} 
        totalCount={totalCount}
        onPaginationChange={handlePaginationChange}
      />

      {/* Drawer */}
      <CustomersDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSuccess={() => {
          setDrawerOpen(false);
          setSelectedCustomer(null);
          refetch();
        }}
      />
    </div>
  );
}
