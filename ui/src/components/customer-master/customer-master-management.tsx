"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCustomers } from "@/hooks/customer-master/use-customer-master";
import { CustomerMasterTable } from "./customer-master-table";
import { CustomerMasterFilter } from "./customer-master-filter";
import { CustomerMasterDrawer } from "./customer-master-drawer";
import { Customer } from "@/types/customer-master";
import { CustomerMasterFilter as CustomerMasterFilterType } from "@/types/customer-master";

export default function CustomerMasterManagement() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [filters, setFilters] = useState<CustomerMasterFilterType>({});

  const { data: customersData, isLoading, refetch } = useCustomers(filters);

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsDrawerOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCustomer(null);
  };

  const handleSuccess = () => {
    refetch();
    handleCloseDrawer();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Master</h1>
          <p className="text-muted-foreground">
            Manage customer information and configurations
          </p>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <CustomerMasterFilter 
        filters={filters}
        onFiltersChange={setFilters}
      />

      <CustomerMasterTable
        customers={customersData?.items || []}
        isLoading={isLoading}
        onEdit={handleEditCustomer}
      />

      <CustomerMasterDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        customer={selectedCustomer}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 