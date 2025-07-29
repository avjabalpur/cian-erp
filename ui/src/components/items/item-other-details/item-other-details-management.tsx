"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItemOtherDetails } from "@/hooks/items/use-item-other-details";
import ItemOtherDetailsTable from "./item-other-details-table";
import ItemOtherDetailsFilter from "./item-other-details-filter";
import ItemOtherDetailsDrawer from "./item-other-details-drawer";

export default function ItemOtherDetailsManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: itemOtherDetails = [], isLoading, refetch } = useItemOtherDetails();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItemOtherDetail, setSelectedItemOtherDetail] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: "",
    itemId: "",
    detailType: "",
    isActive: undefined as boolean | undefined
  });

  const filteredItemOtherDetails = itemOtherDetails.filter((detail) => {
    const matchesSearch = !filters.search || 
      detail.detailName.toLowerCase().includes(filters.search.toLowerCase()) ||
      detail.detailValue?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesItem = !filters.itemId || detail.itemId.toString() === filters.itemId;
    
    const matchesType = !filters.detailType || detail.detailType === filters.detailType;
    
    const matchesActive = filters.isActive === undefined || detail.isActive === filters.isActive;

    return matchesSearch && matchesItem && matchesType && matchesActive;
  });

  const handleCreateItemOtherDetail = () => {
    setSelectedItemOtherDetail(null);
    setDrawerOpen(true);
  };

  const handleEditItemOtherDetail = (detail: any) => {
    setSelectedItemOtherDetail(detail);
    setDrawerOpen(true);
  };

  const handleDeleteItemOtherDetail = async (id: number) => {
    if (!confirm("Are you sure you want to delete this detail?")) return;

    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "Item other detail deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item other detail",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      itemId: "",
      detailType: "",
      isActive: undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/items")}
          className="text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Item Master
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Item Other Details</h1>
          <p className="mt-2 text-gray-600">Manage additional item specifications and details</p>
        </div>
        <Button onClick={handleCreateItemOtherDetail}>
          <Plus className="h-4 w-4 mr-2" />
          Add Detail
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter item other details by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemOtherDetailsFilter 
            filters={filters} 
            onFiltersChange={setFilters} 
            onClearFilters={clearFilters}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Item Other Details ({filteredItemOtherDetails.length})</CardTitle>
          <CardDescription>
            List of all additional item specifications and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemOtherDetailsTable
            itemOtherDetails={filteredItemOtherDetails}
            isLoading={isLoading}
            onEdit={handleEditItemOtherDetail}
            onDelete={handleDeleteItemOtherDetail}
          />
        </CardContent>
      </Card>

      {/* Drawer */}
      <ItemOtherDetailsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        itemOtherDetail={selectedItemOtherDetail}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 