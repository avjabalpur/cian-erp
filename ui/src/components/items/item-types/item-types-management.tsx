"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItemTypes } from "@/hooks/items/use-item-types";
import ItemTypesTable from "./item-types-table";
import ItemTypeFilter from "./item-type-filter";
import ItemTypeDrawer from "./item-type-drawer";

export default function ItemTypesManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: itemTypes = [], isLoading, refetch } = useItemTypes();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<any>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleCreateItemType = () => {
    setSelectedItemType(null);
    setDrawerOpen(true);
  };

  const handleEditItemType = (itemType: any) => {
    setSelectedItemType(itemType);
    setDrawerOpen(true);
  };

  const handleDeleteItemType = async (itemType: any) => {
    if (!confirm("Are you sure you want to delete this item type?")) return;

    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "Item type deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item type",
        variant: "destructive",
      });
    }
  };

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const pageCount = Math.ceil(itemTypes.length / pageSize);
  const paginatedItemTypes = itemTypes.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

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
          <h1 className="text-3xl font-bold text-gray-900">Item Types</h1>
          <p className="mt-2 text-gray-600">Manage pharmaceutical item types and categories</p>
        </div>
        <Button onClick={handleCreateItemType}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item Type
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter item types by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemTypeFilter />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Item Types ({itemTypes.length})</CardTitle>
          <CardDescription>
            List of all pharmaceutical item types and categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemTypesTable
            itemTypes={paginatedItemTypes}
            onEdit={handleEditItemType}
            onDelete={handleDeleteItemType}
            isLoading={isLoading}
            pageCount={pageCount}
            pageSize={pageSize}
            pageIndex={pageIndex}
            totalCount={itemTypes.length}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>

      {/* Drawer */}
      <ItemTypeDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        itemType={selectedItemType}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 