"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConfigLists, useDeleteConfigList } from "@/hooks/config/use-config-lists";
import { useQueryState } from "nuqs";
import { configListParsers } from "@/lib/utils/config-list-utils";
import ConfigListTable from "./config-list-table";
import ConfigListFilter from "./config-list-filter";
import ConfigListDrawer from "./config-list-drawer";
import { ConfigListFilter as ConfigListFilterType } from "@/types/config-list";

export default function ConfigListManagement() {
  const { toast } = useToast();
  const deleteConfigListMutation = useDeleteConfigList();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedConfigList, setSelectedConfigList] = useState<any>(null);

  // URL state management with nuqs
  const [page, setPage] = useQueryState("page", configListParsers.page);
  const [pageSize, setPageSize] = useQueryState("pageSize", configListParsers.pageSize);
  const [search, setsearch] = useQueryState("search", configListParsers.search);
  const [isActive, setIsActive] = useQueryState("isActive", configListParsers.isActive);

  // Construct filter object for API
  const filter: ConfigListFilterType = {
    pageNumber: page || 1,
    pageSize: pageSize || 20,
    search: search || undefined,
    isActive: isActive || undefined,
  };

  const { data: configListData, isLoading, refetch } = useConfigLists(filter);
  const configLists = configListData?.items || [];
  const totalCount = configListData?.totalCount || 0;

  const handlePaginationChange = (pageIndex: number, newPageSize: number) => {
    setPage(pageIndex + 1); // Convert to 1-based indexing
    setPageSize(newPageSize);
  };

  const handleCreateConfigList = () => {
    setSelectedConfigList(null);
    setDrawerOpen(true);
  };

  const handleEditConfigList = (configList: any) => {
    setSelectedConfigList(configList);
    setDrawerOpen(true);
  };

  const handleDeleteConfigList = async (configList: any) => {
    if (!confirm("Are you sure you want to delete this config list?")) return;

    try {
      await deleteConfigListMutation.mutateAsync(configList.id);
      toast({
        title: "Success",
        description: "Config list deleted successfully",
      });
      refetch();
    } catch (error: any) {
      console.error('Delete config list failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete config list",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Config Lists</h1>
        </div>
        <Button onClick={handleCreateConfigList}>
          <Plus className="h-4 w-4 mr-2" />
          Add Config List
        </Button>
      </div>

      <ConfigListFilter />

      <ConfigListTable
        configLists={configLists}
        isLoading={isLoading}
        onEdit={handleEditConfigList}
        onDelete={handleDeleteConfigList}
        pageCount={Math.ceil(totalCount / (pageSize || 20))}
        pageSize={pageSize || 20}
        pageIndex={(page || 1) - 1} 
        totalCount={totalCount}
        onPaginationChange={handlePaginationChange}
      />

      {/* Drawer */}
      <ConfigListDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        configList={selectedConfigList}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 