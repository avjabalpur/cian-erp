"use client";

import { useState, useEffect } from "react";
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
import { useItemSpecification } from "@/hooks/items/use-item-specifications";
import { useItemExportDetails } from "@/hooks/items/use-item-export-details";
import { useItemStockAnalysisByItemId } from "@/hooks/items/use-item-stock-analysis";
import { useItemBoughtOutDetails } from "@/hooks/items/use-item-bought-out-details";
import { useItemOtherDetailsByItemId } from "@/hooks/items/use-item-other-details";

export default function ItemsManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const deleteItemMutation = useDeleteItemMaster();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemMaster | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  // Hooks for fetching related data
  const { data: specificationData } = useItemSpecification(editingItemId || 0);
  const { data: exportDetailsData } = useItemExportDetails(editingItemId || 0);
  const { data: stockAnalysisData } = useItemStockAnalysisByItemId(editingItemId || 0);
  const { data: boughtOutDetailsData } = useItemBoughtOutDetails(editingItemId || 0);
  const { data: otherDetailsData } = useItemOtherDetailsByItemId(editingItemId || 0);

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

  // Effect to update the selected item when related data is loaded
  useEffect(() => {
    if (editingItemId && selectedItem && selectedItem.id === editingItemId) {
      // Check if we already have the enhanced data to prevent infinite loops
      const hasEnhancedData = (selectedItem as any).specification || (selectedItem as any).exportDetails || selectedItem.stockAnalysis || selectedItem.boughtOutDetails || (selectedItem as any).otherDetails;
      
      if (!hasEnhancedData) {
        const enhancedItem = {
          ...selectedItem,
          // Add specification data
          specification: specificationData || undefined,
          // Add export details data
          exportDetails: exportDetailsData || undefined,
          // Add stock analysis data (take first item if array)
          stockAnalysis: stockAnalysisData && stockAnalysisData.length > 0 ? stockAnalysisData[0] : undefined,
          // Add bought out details data
          boughtOutDetails: boughtOutDetailsData || undefined,
          // Add other details data (take first item if array)
          otherDetails: otherDetailsData && otherDetailsData.length > 0 ? otherDetailsData[0] : undefined,
        } as ItemMaster;
        
        setSelectedItem(enhancedItem);
      }
    }
  }, [editingItemId, selectedItem?.id, specificationData, exportDetailsData, stockAnalysisData, boughtOutDetailsData, otherDetailsData]);

  const handleEditItem = (item: ItemMaster) => {
    // Set the editing item ID to trigger the hooks
    setEditingItemId(item.id);
    
    // Initially set the item without related data
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
          setEditingItemId(null);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSuccess={() => {
          setDrawerOpen(false);
          setEditingItemId(null);
          setSelectedItem(null);
          refetch();
        }}
      />
    </div>
  );
} 