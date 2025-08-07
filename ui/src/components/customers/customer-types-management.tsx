"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCustomerTypes, useDeleteCustomerType } from "@/hooks/customers/use-customer-types";
import { useQueryState } from "nuqs";
import { customerTypeFilterParsers } from "@/lib/utils/customer-type-utils";
import CustomerTypesTable from "./customer-types-table";
import CustomerTypesDrawer from "./customer-types-drawer";
import { CustomerTypeFilter, CustomerType } from "@/types/customer-type";

export default function CustomerTypesManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const deleteCustomerTypeMutation = useDeleteCustomerType();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType | null>(null);

  // URL state management with nuqs
  const [page, setPage] = useQueryState("page", customerTypeFilterParsers.pageNumber);
  const [pageSize, setPageSize] = useQueryState("pageSize", customerTypeFilterParsers.pageSize);
  const [search, setSearch] = useQueryState("search", customerTypeFilterParsers.search);
  const [code, setCode] = useQueryState("code", customerTypeFilterParsers.code);
  const [name, setName] = useQueryState("name", customerTypeFilterParsers.name);
  const [isActive, setIsActive] = useQueryState("isActive", customerTypeFilterParsers.isActive);
  const [sortBy, setSortBy] = useQueryState("sortBy", customerTypeFilterParsers.sortBy);
  const [sortDescending, setSortDescending] = useQueryState("sortDescending", customerTypeFilterParsers.sortDescending);

  // Construct filter object for API
  const filter: CustomerTypeFilter = {
    page: page || 1,
    pageSize: pageSize || 20,
    search: search || undefined,
    code: code || undefined,
    name: name || undefined,
    isActive: isActive || undefined,
    sortBy: sortBy || 'name',
    sortDescending: sortDescending || false,
  };

  const { data: customerTypesData, isLoading, refetch } = useCustomerTypes(filter);
  const customerTypes = customerTypesData?.items || [];
  const totalCount = customerTypesData?.totalCount || 0;

  const handlePaginationChange = (pageIndex: number, newPageSize: number) => {
    setPage(pageIndex + 1); // Convert to 1-based indexing
    setPageSize(newPageSize);
  };

  const handleCreateCustomerType = () => {
    setSelectedCustomerType(null);
    setDrawerOpen(true);
  };

  const handleEditCustomerType = (customerType: CustomerType) => {
    setSelectedCustomerType(customerType);
    setDrawerOpen(true);
  };

  const handleDeleteCustomerType = async (customerType: CustomerType) => {
    try {
      await deleteCustomerTypeMutation.mutateAsync(customerType.id.toString());
      toast({
        title: "Success",
        description: "Customer type deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer type",
        variant: "destructive",
      });
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCustomerType(null);
  };

  const handleDrawerSuccess = () => {
    refetch();
    handleDrawerClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold tracking-tight">Customer Types</h1>
        </div>
        <Button onClick={handleCreateCustomerType} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Customer Type</span>
        </Button>
      </div>

      <CustomerTypesTable
            customerTypes={customerTypes}
            isLoading={isLoading}
            onEdit={handleEditCustomerType}
            onDelete={handleDeleteCustomerType}
            pagination={{
              pageIndex: (page || 1) - 1,
              pageSize: pageSize || 20,
              pageCount: Math.ceil(totalCount / (pageSize || 20)),
              totalCount,
            }}
            onPaginationChange={handlePaginationChange}
          />

      <CustomerTypesDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        customerType={selectedCustomerType}
        onSuccess={handleDrawerSuccess}
      />
    </div>
  );
}
