"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItemMasters, useDeleteItemMaster } from "@/hooks/items/use-item-master";
import { useQueryState } from "nuqs";
import { itemMasterFilterParsers } from "@/lib/utils/item-master-utils";
import ItemsTable from "./items-table";
import ItemsFilter from "./items-filter";
import ItemsDrawer from "./items-drawer";
import { ItemMasterFilter, ItemMaster } from "@/types/item-master";

export default function ItemsManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const deleteItemMutation = useDeleteItemMaster();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemMaster | null>(null);

  // URL state management with nuqs
  const [page, setPage] = useQueryState("page", itemMasterFilterParsers.pageNumber);
  const [pageSize, setPageSize] = useQueryState("pageSize", itemMasterFilterParsers.pageSize);
  const [search, setsearch] = useQueryState("search", itemMasterFilterParsers.search);
  const [itemCode, setItemCode] = useQueryState("itemCode", itemMasterFilterParsers.itemCode);
  const [itemName, setItemName] = useQueryState("itemName", itemMasterFilterParsers.itemName);
  const [itemTypeId, setItemTypeId] = useQueryState("itemTypeId", itemMasterFilterParsers.itemTypeId);
  const [manufactured, setManufactured] = useQueryState("manufactured", itemMasterFilterParsers.manufactured);
  const [qcRequired, setQcRequired] = useQueryState("qcRequired", itemMasterFilterParsers.qcRequired);
  const [sortBy, setSortBy] = useQueryState("sortBy", itemMasterFilterParsers.sortBy);
  const [sortDescending, setSortDescending] = useQueryState("sortDescending", itemMasterFilterParsers.sortDescending);

  // Construct filter object for API
  const filter: ItemMasterFilter = {
    pageNumber: page || 1,
    pageSize: pageSize || 20,
    search: search || undefined,
    itemCode: itemCode || undefined,
    itemName: itemName || undefined,
    itemTypeId: itemTypeId || undefined,
    manufactured: manufactured || undefined,
    qcRequired: qcRequired || undefined,
    sortBy: sortBy || 'itemName',
    sortDescending: sortDescending || false,
  };

  const { data: itemsData, isLoading, refetch } = useItemMasters(filter);
  const items = itemsData?.items || [];
  const totalCount = itemsData?.totalCount || 0;

  const handlePaginationChange = (pageIndex: number, newPageSize: number) => {
    setPage(pageIndex + 1); // Convert to 1-based indexing
    setPageSize(newPageSize);
  };

  const handleCreateItem = () => {
    setSelectedItem(null);
    setDrawerOpen(true);
  };

  const handleEditItem = (item: ItemMaster) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleDeleteItem = async (item: ItemMaster) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteItemMutation.mutateAsync(item.id);
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      refetch();
    } catch (error: any) {
      console.error('Delete item failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Item Master</h1>
        </div>
        <Button onClick={handleCreateItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <ItemsFilter />

      <ItemsTable
        items={items}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        isLoading={isLoading}
        pageCount={Math.ceil(totalCount / (pageSize || 20))}
        pageSize={pageSize || 20}
        pageIndex={(page || 1) - 1} 
        totalCount={totalCount}
        onPaginationChange={handlePaginationChange}
      />

      {/* Drawer */}
      <ItemsDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSuccess={() => {
          setDrawerOpen(false);
          setSelectedItem(null);
          refetch();
        }}
      />
    </div>
  );
} 