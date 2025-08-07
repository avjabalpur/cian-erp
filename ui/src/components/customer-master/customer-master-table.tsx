"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Customer } from "@/types/customer-master";
import { useDeleteCustomer } from "@/hooks/customer-master/use-customer-master";
import { useToast } from "@/hooks/use-toast";

interface CustomerMasterTableProps {
  customers: Customer[];
  isLoading: boolean;
  onEdit: (customer: Customer) => void;
}

export function CustomerMasterTable({
  customers,
  isLoading,
  onEdit,
}: CustomerMasterTableProps) {
  const { toast } = useToast();
  const deleteCustomerMutation = useDeleteCustomer();

  const handleDelete = async (customer: Customer) => {
    try {
      await deleteCustomerMutation.mutateAsync(customer.id);
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Code</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Short Name</TableHead>
            <TableHead>Customer Type</TableHead>
            <TableHead>GSTIN</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Export Customer</TableHead>
            <TableHead>Registered Dealer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No customers found
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.customerCode}
                </TableCell>
                <TableCell>{customer.customerName}</TableCell>
                <TableCell>{customer.shortName || "-"}</TableCell>
                <TableCell>{customer.customerTypeCode || "-"}</TableCell>
                <TableCell>{customer.gstin || "-"}</TableCell>
                <TableCell>
                  <Badge variant={customer.isActive ? "default" : "secondary"}>
                    {customer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={customer.isExportCustomer ? "default" : "outline"}>
                    {customer.isExportCustomer ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={customer.isRegisteredDealer ? "default" : "outline"}>
                    {customer.isRegisteredDealer ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(customer)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(customer)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 