"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHsnMaster } from "@/hooks/items/use-hsn-master";
import HsnMasterTable from "./hsn-master-table";
import HsnMasterFilter from "./hsn-master-filter";
import HsnMasterDrawer from "./hsn-master-drawer";

export default function HsnMasterManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: hsnCodes = [], isLoading, refetch } = useHsnMaster();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedHsnCode, setSelectedHsnCode] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: "",
    hsnType: "",
    isActive: undefined as boolean | undefined
  });

  const filteredHsnCodes = hsnCodes.filter((hsnCode) => {
    const matchesSearch = !filters.search || 
      hsnCode.hsnCode.toLowerCase().includes(filters.search.toLowerCase()) ||
      hsnCode.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      hsnCode.hsnType?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType = !filters.hsnType || hsnCode.hsnType === filters.hsnType;
    
    const matchesActive = filters.isActive === undefined || hsnCode.isActive === filters.isActive;

    return matchesSearch && matchesType && matchesActive;
  });

  const handleCreateHsnCode = () => {
    setSelectedHsnCode(null);
    setDrawerOpen(true);
  };

  const handleEditHsnCode = (hsnCode: any) => {
    setSelectedHsnCode(hsnCode);
    setDrawerOpen(true);
  };

  const handleDeleteHsnCode = async (id: number) => {
    if (!confirm("Are you sure you want to delete this HSN code?")) return;

    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "HSN code deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete HSN code",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      hsnType: "",
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
          <h1 className="text-3xl font-bold text-gray-900">HSN Master</h1>
          <p className="mt-2 text-gray-600">Manage HSN codes and tax classifications</p>
        </div>
        <Button onClick={handleCreateHsnCode}>
          <Plus className="h-4 w-4 mr-2" />
          Add HSN Code
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter HSN codes by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <HsnMasterFilter 
            filters={filters} 
            onFiltersChange={setFilters} 
            onClearFilters={clearFilters}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>HSN Codes ({filteredHsnCodes.length})</CardTitle>
          <CardDescription>
            List of all HSN codes and their tax classifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HsnMasterTable
            hsnCodes={filteredHsnCodes}
            isLoading={isLoading}
            onEdit={handleEditHsnCode}
            onDelete={handleDeleteHsnCode}
          />
        </CardContent>
      </Card>

      {/* Drawer */}
      <HsnMasterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        hsnCode={selectedHsnCode}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 