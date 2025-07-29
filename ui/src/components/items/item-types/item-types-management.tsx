"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItemTypes, useDeleteItemType} from "@/hooks/items/use-item-types";
import { itemTypeParsers } from "@/lib/utils/item-master-utils";
import ItemTypesTable from "./item-types-table";
import ItemTypeDrawer from "./item-type-drawer";
import { ItemTypeFilter } from "@/types/item";
import { ItemTypeFilter as ItemTypeFilterComponent } from "./item-type-filter";

export default function ItemTypesManagement() {
  const router = useRouter();
  const { toast } = useToast();
  
  // nuqs query state hooks
  const [page, setPage] = useQueryState("page", itemTypeParsers.page);
  const [pageSize, setPageSize] = useQueryState("pageSize", itemTypeParsers.pageSize);
  const [searchTerm, setSearchTerm] = useQueryState("searchTerm", itemTypeParsers.searchTerm);
  const [isActive, setIsActive] = useQueryState("isActive", itemTypeParsers.isActive);

  // Convert nuqs state to API filter
  const filter: ItemTypeFilter = {
    pageNumber: page,
    pageSize: pageSize,
    searchTerm: searchTerm || undefined,
    isActive: isActive ?? undefined,
  };

  // Query with pagination
  const { 
    data: paginatedData, 
    isLoading, 
    error,
    refetch 
  } = useItemTypes(filter);

  // Extract data from paginated response
  const itemTypes = paginatedData?.items || [];
  const totalCount = paginatedData?.totalCount || 0;
  const totalPages = paginatedData?.totalPages || 0;
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<any>(null);

  // Delete mutation
  const deleteItemTypeMutation = useDeleteItemType();

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load item types. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
      await deleteItemTypeMutation.mutateAsync(itemType.id);
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
    // Update nuqs state (API uses 1-based pagination)
    setPage(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  const handleFilterChange = (filters: any) => {
    // This will be handled by nuqs automatically through the filter component
    // The component will re-render with new filter values
  };

  const handleGlobalFilterChange = (value: string) => {
    setSearchTerm(value || null);
    setPage(1); // Reset to first page when searching
  };

  const handleSuccess = () => {
    setDrawerOpen(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Item Types</h1>
        </div>
        <Button onClick={handleCreateItemType}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item Type
        </Button>
      </div>

      {/* Filter Component */}
      {/* <ItemTypeFilterComponent onFilterChange={handleFilterChange} /> */}

      {/* Table */}
      <ItemTypesTable
        itemTypes={itemTypes}
        onEdit={handleEditItemType}
        onDelete={handleDeleteItemType}
        isLoading={isLoading}
        pageCount={totalPages}
        pageSize={pageSize}
        pageIndex={(page || 1) - 1} // Convert 1-based to 0-based for table
        totalCount={totalCount}
        onPaginationChange={handlePaginationChange}
        onGlobalFilterChange={handleGlobalFilterChange}
      />

      {/* Drawer */}
      <ItemTypeDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        itemType={selectedItemType}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 