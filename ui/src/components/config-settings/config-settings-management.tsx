"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConfigSettings, useDeleteConfigSetting } from "@/hooks/use-config-settings";
import { useQueryState } from "nuqs";
import { configSettingParsers } from "@/lib/utils/config-setting-utils";
import ConfigSettingTable from "./config-setting-table";
import ConfigSettingFilter from "./config-setting-filter";
import { ConfigSettingFilter as ConfigSettingFilterType } from "@/types/config-setting";
import { ConfigSettingDrawer } from "./config-setting-drawer";

export default function ConfigSettingsManagement() {
  const { toast } = useToast();
  const deleteConfigSettingMutation = useDeleteConfigSetting();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedConfigSetting, setSelectedConfigSetting] = useState<any>(null);

  // URL state management with nuqs
  const [page, setPage] = useQueryState("page", configSettingParsers.page);
  const [pageSize, setPageSize] = useQueryState("pageSize", configSettingParsers.pageSize);
  const [search, setSearch] = useQueryState("search", configSettingParsers.search);
  const [isActive, setIsActive] = useQueryState("isActive", configSettingParsers.isActive);


  const { data: configSettingData, isLoading, refetch } = useConfigSettings({
    page: page || 1,
    pageSize: pageSize || 20,
    search: search || undefined,
    isActive: isActive || undefined,
  });
  const configSettings = configSettingData?.items || [];
  const totalCount = configSettingData?.totalCount || 0;

  const handlePaginationChange = (pageIndex: number, newPageSize: number) => {
    setPage(pageIndex + 1); // Convert to 1-based indexing
    setPageSize(newPageSize);
  };

  const handleCreateConfigSetting = () => {
    setSelectedConfigSetting(null);
    setDrawerOpen(true);
  };

  const handleEditConfigSetting = (configSetting: any) => {
    setSelectedConfigSetting(configSetting);
    setDrawerOpen(true);
  };

  const handleDeleteConfigSetting = async (configSetting: any) => {
    if (!confirm("Are you sure you want to delete this config setting?")) return;

    try {
      await deleteConfigSettingMutation.mutateAsync(configSetting.id);
      toast({
        title: "Success",
        description: "Config setting deleted successfully",
      });
      refetch();
    } catch (error: any) {
      console.error('Delete config setting failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete config setting",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Config Settings</h1>
        </div>
        <Button onClick={handleCreateConfigSetting}>
          <Plus className="h-4 w-4 mr-2" />
          Add Config Setting
        </Button>
      </div>

      <ConfigSettingFilter />

      <ConfigSettingTable
        configSettings={configSettings}
        isLoading={isLoading}
        onEdit={handleEditConfigSetting}
        onDelete={handleDeleteConfigSetting}
        pageCount={Math.ceil(totalCount / (pageSize || 20))}
        pageSize={pageSize || 20}
        pageIndex={(page || 1) - 1} 
        totalCount={totalCount}
        onPaginationChange={handlePaginationChange}
      />

      {/* Drawer */}
      <ConfigSettingDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        configSetting={selectedConfigSetting}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 