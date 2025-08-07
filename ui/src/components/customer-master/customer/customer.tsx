"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerType } from "@/types/customer-master";
import { useToast } from "@/hooks/use-toast";
import { useCustomerTypes, useDeleteCustomerType } from "@/hooks/customer-master/use-customer-types";

// Fallback mock data for customer types
const mockCustomerTypes: CustomerType[] = [
  {
    id: 1,
    code: "DOM",
    name: "Domestic Customer",
    description: "Regular domestic customers",
    isExportType: false,
    isDomesticType: true,
    requiresDrugLicense: false,
    creditTermsApplicable: true,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 2,
    code: "EXP",
    name: "Export Customer",
    description: "International export customers",
    isExportType: true,
    isDomesticType: false,
    requiresDrugLicense: true,
    creditTermsApplicable: true,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: 1,
    updatedBy: 1,
  },
  {
    id: 3,
    code: "WHL",
    name: "Wholesale Customer",
    description: "Wholesale distributors",
    isExportType: false,
    isDomesticType: true,
    requiresDrugLicense: false,
    creditTermsApplicable: true,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: 1,
    updatedBy: 1,
  },
];

export default function CustomerMasterTable() {
  const { toast } = useToast();
  const deleteCustomerTypeMutation = useDeleteCustomerType();
  
  // Try to use real API data, fallback to mock data
  const { data: customerTypesData, isLoading, error } = useCustomerTypes();
  const customerTypes = customerTypesData?.items || mockCustomerTypes;

  const handleEdit = (customerType: CustomerType) => {
    // TODO: Implement edit functionality - open edit modal or navigate to edit page
    console.log("Edit customer type:", customerType);
    toast({
      title: "Edit Customer Type",
      description: `Editing ${customerType.name}`,
    });
  };

  const handleDelete = async (customerType: CustomerType) => {
    try {
      await deleteCustomerTypeMutation.mutateAsync(customerType.id);
      toast({
        title: "Success",
        description: "Customer type deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete customer type",
        variant: "destructive",
      });
    }
  };

  const handleAddCustomer = () => {
    // TODO: Navigate to customer creation page or open modal
    toast({
      title: "Add Customer",
      description: "Opening customer creation form",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customer Master</h1>
            <p className="text-muted-foreground">
              Manage customer types and customer information
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
        <div className="space-y-3">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Master</h1>
          <p className="text-muted-foreground">
            Manage customer types and customer information
          </p>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Export Type</TableHead>
                  <TableHead>Domestic Type</TableHead>
                  <TableHead>Drug License Required</TableHead>
                  <TableHead>Credit Terms</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No customer types found
                    </TableCell>
                  </TableRow>
                ) : (
                  customerTypes.map((customerType) => (
                    <TableRow key={customerType.id}>
                      <TableCell className="font-medium">
                        {customerType.code}
                      </TableCell>
                      <TableCell>{customerType.name}</TableCell>
                      <TableCell>{customerType.description || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={customerType.isExportType ? "default" : "outline"}>
                          {customerType.isExportType ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customerType.isDomesticType ? "default" : "outline"}>
                          {customerType.isDomesticType ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customerType.requiresDrugLicense ? "default" : "outline"}>
                          {customerType.requiresDrugLicense ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customerType.creditTermsApplicable ? "default" : "outline"}>
                          {customerType.creditTermsApplicable ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customerType.isActive ? "default" : "secondary"}>
                          {customerType.isActive ? "Active" : "Inactive"}
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
                            <DropdownMenuItem onClick={() => handleEdit(customerType)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(customerType)}
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
        </CardContent>
      </Card>

      {/* Additional sections for other customer-related tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Customer addresses and contact information will be displayed here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Banking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Customer banking information will be displayed here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Shipping, logistics, and financial terms will be displayed here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax & Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tax configuration and compliance settings will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
