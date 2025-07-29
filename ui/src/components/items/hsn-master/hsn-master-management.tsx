"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHsnMaster, useDeleteHsnMaster } from "@/hooks/items/use-hsn-master";
import { useQueryState } from "nuqs";
import { hsnMasterParsers } from "@/lib/utils/hsn-master-utils";
import HsnMasterTable from "./hsn-master-table";
import HsnMasterFilter from "./hsn-master-filter";
import HsnMasterDrawer from "./hsn-master-drawer";
import { HsnMasterFilter as HsnMasterFilterType } from "@/types/hsn-master";

export default function HsnMasterManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const deleteHsnMasterMutation = useDeleteHsnMaster();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedHsnMaster, setSelectedHsnMaster] = useState<any>(null);

  // URL state management with nuqs
  const [page, setPage] = useQueryState("page", hsnMasterParsers.page);
  const [pageSize, setPageSize] = useQueryState("pageSize", hsnMasterParsers.pageSize);
  const [searchTerm, setSearchTerm] = useQueryState("search", hsnMasterParsers.search);
  const [isActive, setIsActive] = useQueryState("isActive", hsnMasterParsers.isActive);

  // Construct filter object for API
  const filter: HsnMasterFilterType = {
    pageNumber: page || 1,
    pageSize: pageSize || 20,
    search: searchTerm || undefined,
    isActive: isActive || undefined,
  };

  const { data: hsnMasterData, isLoading, refetch } = useHsnMaster(filter);
  const hsnCodes = hsnMasterData?.items || [];
  const totalCount = hsnMasterData?.totalCount || 0;

  const handlePaginationChange = (pageIndex: number, newPageSize: number) => {
    setPage(pageIndex + 1); // Convert to 1-based indexing
    setPageSize(newPageSize);
  };

  const handleCreateHsnCode = () => {
    setSelectedHsnMaster(null);
    setDrawerOpen(true);
  };

  const handleEditHsnCode = (hsnCode: any) => {
    setSelectedHsnMaster(hsnCode);
    setDrawerOpen(true);
  };

  const handleDeleteHsnCode = async (hsnCode: any) => {
    if (!confirm("Are you sure you want to delete this HSN code?")) return;

    try {
      await deleteHsnMasterMutation.mutateAsync(hsnCode.id);
      toast({
        title: "Success",
        description: "HSN code deleted successfully",
      });
      refetch();
    } catch (error: any) {
      console.error('Delete HSN master failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete HSN code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">HSN Master</h1>
        </div>
        <Button onClick={handleCreateHsnCode}>
          <Plus className="h-4 w-4 mr-2" />
          Add HSN Code
        </Button>
      </div>

      <HsnMasterFilter />

      
          <HsnMasterTable
            hsnCodes={hsnCodes}
            isLoading={isLoading}
            onEdit={handleEditHsnCode}
            onDelete={handleDeleteHsnCode}
            pageCount={Math.ceil(totalCount / (pageSize || 20))}
            pageSize={pageSize || 20}
            pageIndex={(page || 1) - 1} 
            totalCount={totalCount}
            onPaginationChange={handlePaginationChange}
          />
        

      {/* Drawer */}
      <HsnMasterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        hsnMaster={selectedHsnMaster}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 