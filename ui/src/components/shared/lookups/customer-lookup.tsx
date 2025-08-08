"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, X } from "lucide-react";
import { useCustomerOptions } from "@/hooks/customers/use-customer-options";

interface Customer {
  id: number;
  customerCode: string;
  customerName: string;
  shortName?: string;
  gstin?: string;
  isActive: boolean;
}

interface CustomerLookupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (customerId: number) => void;
  title?: string;
  excludeId?: number;
}

export function CustomerLookup({
  isOpen,
  onClose,
  onSelect,
  title = "Select Customer",
  excludeId
}: CustomerLookupProps) {
  const [search, setSearch] = useState("");

  // Fetch customers with search
  const { data: customerOptions, isLoading } = useCustomerOptions(excludeId);

  // Filter customers based on search
  const filteredCustomers = customerOptions?.filter(customer => 
    customer.data.customerName.toLowerCase().includes(search.toLowerCase()) ||
    customer.data.customerCode.toLowerCase().includes(search.toLowerCase()) ||
    (customer.data.shortName && customer.data.shortName.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  const handleCustomerSelect = (customerId: number) => {
    onSelect(customerId);
    onClose();
    setSearch("");
  };

  const handleClose = () => {
    onClose();
    setSearch("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, code, or short name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Customers Table */}
          <div className="flex-1 overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Short Name</TableHead>
                  <TableHead>GSTIN</TableHead>
                  <TableHead className="w-20">Status</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {search ? "No customers found" : "No customers available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customerOption) => {
                    const customer = customerOption.data;
                    return (
                      <TableRow key={customer.id} className="hover:bg-muted/50">
                        <TableCell className="p-2">
                          {customer.id}
                        </TableCell>
                        <TableCell className="font-medium p-2">
                          {customer.customerCode}
                        </TableCell>
                        <TableCell className="p-2">
                          {customer.customerName}
                        </TableCell>
                        <TableCell className="text-muted-foreground p-2">
                          {customer.shortName || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground p-2">
                          {customer.gstin || "-"}
                        </TableCell>
                        <TableCell className="p-2">
                          <Badge variant={customer.isActive ? "default" : "secondary"}>
                            {customer.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-0">
                          <Button
                            size="sm"
                            onClick={() => handleCustomerSelect(customer.id)}
                            className="h-6"
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
            </div>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 