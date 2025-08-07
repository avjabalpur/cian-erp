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
  const [page] = useQueryState("page", customerTypeFilterParsers.pageNumber);
  const [pageSize] = useQueryState("pageSize", customerTypeFilterParsers.pageSize);
  const [search] = useQueryState("search", customerTypeFilterParsers.search);
  const [code] = useQueryState("code", customerTypeFilterParsers.code);
  const [name] = useQueryState("name", customerTypeFilterParsers.name);
  const [isActive] = useQueryState("isActive", customerTypeFilterParsers.isActive);
  const [sortBy] = useQueryState("sortBy", customerTypeFilterParsers.sortBy);
  const [sortDescending] = useQueryState("sortDescending", customerTypeFilterParsers.sortDescending);

  const { data: customerTypesData, isLoading, refetch } = useCustomerTypes({
    page: page || 1,
    pageSize: pageSize || 10,
    search: search || undefined,
    code: code || undefined,
    name: name || undefined,
    isActive: isActive === true ? true : isActive === false ? false : undefined,
    sortBy: sortBy || "name",
    sortDescending: sortDescending || false
  });
  const customerTypes = customerTypesData?.items || [];
  const totalCount = customerTypesData?.totalCount || 0;

  const handlePaginationChange = (pageIndex: number, newPageSize: number) => {
    // Handle pagination if needed
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

      <Card>
        <CardContent className="space-y-4 pt-4">
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
        </CardContent>
      </Card>

      <CustomerTypesDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        customerType={selectedCustomerType}
        onSuccess={handleDrawerSuccess}
      />
    </div>
  );
}
