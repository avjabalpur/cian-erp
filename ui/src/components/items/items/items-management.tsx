"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItems } from "@/hooks/items/use-items";
import ItemsTable from "./items-table";
import ItemsFilter from "./items-filter";
import ItemsDrawer from "./items-drawer";

export default function ItemsManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: items = [], isLoading, refetch } = useItems();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleCreateItem = () => {
    setSelectedItem(null);
    setDrawerOpen(true);
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleDeleteItem = async (item: any) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const pageCount = Math.ceil(items.length / pageSize);
  const paginatedItems = items.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

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
          <h1 className="text-3xl font-bold text-gray-900">Items</h1>
          <p className="mt-2 text-gray-600">Manage pharmaceutical items and products</p>
        </div>
        <Button onClick={handleCreateItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter items by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemsFilter />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({items.length})</CardTitle>
          <CardDescription>
            List of all pharmaceutical items and products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemsTable
            items={paginatedItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            isLoading={isLoading}
            pageCount={pageCount}
            pageSize={pageSize}
            pageIndex={pageIndex}
            totalCount={items.length}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>

      {/* Drawer */}
      <ItemsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={selectedItem}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 