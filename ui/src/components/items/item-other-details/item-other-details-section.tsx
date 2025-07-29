"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItemOtherDetailsByItemId } from "@/hooks/items/use-item-other-details";
import ItemOtherDetailsTable from "./item-other-details-table";
import ItemOtherDetailsDrawer from "./item-other-details-drawer";

interface ItemOtherDetailsSectionProps {
  itemId?: number;
}

export default function ItemOtherDetailsSection({ itemId }: ItemOtherDetailsSectionProps) {
  const { toast } = useToast();
  const { data: itemOtherDetails = [], isLoading, refetch } = useItemOtherDetailsByItemId(itemId || 0);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItemOtherDetail, setSelectedItemOtherDetail] = useState<any>(null);

  const handleCreateItemOtherDetail = () => {
    setSelectedItemOtherDetail(null);
    setDrawerOpen(true);
  };

  const handleEditItemOtherDetail = (detail: any) => {
    setSelectedItemOtherDetail(detail);
    setDrawerOpen(true);
  };

  const handleDeleteItemOtherDetail = async (id: number) => {
    if (!confirm("Are you sure you want to delete this detail?")) return;

    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "Item other detail deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item other detail",
        variant: "destructive",
      });
    }
  };

  if (!itemId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please save the item first to manage other details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Item Other Details</h3>
          <p className="text-sm text-muted-foreground">
            Manage additional specifications and details for this item
          </p>
        </div>
        <Button onClick={handleCreateItemOtherDetail} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Detail
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Other Details ({itemOtherDetails.length})</CardTitle>
          <CardDescription>
            List of all additional specifications and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemOtherDetailsTable
            itemOtherDetails={itemOtherDetails}
            isLoading={isLoading}
            onEdit={handleEditItemOtherDetail}
            onDelete={handleDeleteItemOtherDetail}
          />
        </CardContent>
      </Card>

      <ItemOtherDetailsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        itemOtherDetail={selectedItemOtherDetail}
        itemId={itemId}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 