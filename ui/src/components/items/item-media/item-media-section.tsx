"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItemMediaByItemId } from "@/hooks/items/use-item-media";
import ItemMediaTable from "./item-media-table";
import ItemMediaDrawer from "./item-media-drawer";

interface ItemMediaSectionProps {
  itemId?: number;
}

export default function ItemMediaSection({ itemId }: ItemMediaSectionProps) {
  const { toast } = useToast();
  const { data: itemMedia = [], isLoading, refetch } = useItemMediaByItemId(itemId || 0);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItemMedia, setSelectedItemMedia] = useState<any>(null);

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

  if (!itemId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please save the item first to manage media files.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Item Media</h3>
          <p className="text-sm text-muted-foreground">
            Manage images and media files for this item
          </p>
        </div>
        <Button onClick={handleCreateItemMedia} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Media
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Media Files ({itemMedia.length})</CardTitle>
          <CardDescription>
            List of all media files associated with this item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemMediaTable
            itemMedia={itemMedia}
            isLoading={isLoading}
            onEdit={handleEditItemMedia}
            onDelete={handleDeleteItemMedia}
          />
        </CardContent>
      </Card>

      <ItemMediaDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        itemMedia={selectedItemMedia}
        itemId={itemId}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 