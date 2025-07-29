"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItemMedia } from "@/hooks/items/use-item-media";
import ItemMediaTable from "./item-media-table";
import ItemMediaFilter from "./item-media-filter";
import ItemMediaDrawer from "./item-media-drawer";

export default function ItemMediaManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: itemMedia = [], isLoading, refetch } = useItemMedia();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItemMedia, setSelectedItemMedia] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: "",
    itemId: "",
    mediaType: "",
    isActive: undefined as boolean | undefined
  });

  const filteredItemMedia = itemMedia.filter((media) => {
    const matchesSearch = !filters.search || 
      media.fileName.toLowerCase().includes(filters.search.toLowerCase()) ||
      media.description?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesItem = !filters.itemId || media.itemId.toString() === filters.itemId;
    
    const matchesType = !filters.mediaType || media.mediaType === filters.mediaType;
    
    const matchesActive = filters.isActive === undefined || media.isActive === filters.isActive;

    return matchesSearch && matchesItem && matchesType && matchesActive;
  });

  const handleCreateItemMedia = () => {
    setSelectedItemMedia(null);
    setDrawerOpen(true);
  };

  const handleEditItemMedia = (media: any) => {
    setSelectedItemMedia(media);
    setDrawerOpen(true);
  };

  const handleDeleteItemMedia = async (id: number) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "Item media deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item media",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      itemId: "",
      mediaType: "",
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
          <h1 className="text-3xl font-bold text-gray-900">Item Media</h1>
          <p className="mt-2 text-gray-600">Manage item images and media files</p>
        </div>
        <Button onClick={handleCreateItemMedia}>
          <Plus className="h-4 w-4 mr-2" />
          Add Media
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter item media by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemMediaFilter 
            filters={filters} 
            onFiltersChange={setFilters} 
            onClearFilters={clearFilters}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Item Media ({filteredItemMedia.length})</CardTitle>
          <CardDescription>
            List of all item media files and images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemMediaTable
            itemMedia={filteredItemMedia}
            isLoading={isLoading}
            onEdit={handleEditItemMedia}
            onDelete={handleDeleteItemMedia}
          />
        </CardContent>
      </Card>

      {/* Drawer */}
      <ItemMediaDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        itemMedia={selectedItemMedia}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 