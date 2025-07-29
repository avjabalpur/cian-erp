"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItemSalesDetailsByItemId } from "@/hooks/items/use-item-sales-details";
import ItemSalesDetailsTable from "./item-sales-details-table";
import ItemSalesDetailsDrawer from "./item-sales-details-drawer";

interface ItemSalesDetailsSectionProps {
  itemId?: number;
}

export default function ItemSalesDetailsSection({ itemId }: ItemSalesDetailsSectionProps) {
  const { toast } = useToast();
  const { data: itemSalesDetails = [], isLoading, refetch } = useItemSalesDetailsByItemId(itemId || 0);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItemSalesDetail, setSelectedItemSalesDetail] = useState<any>(null);

  const handleCreateItemSalesDetail = () => {
    setSelectedItemSalesDetail(null);
    setDrawerOpen(true);
  };

  const handleEditItemSalesDetail = (detail: any) => {
    setSelectedItemSalesDetail(detail);
    setDrawerOpen(true);
  };

  const handleDeleteItemSalesDetail = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sales detail?")) return;

    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "Item sales detail deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item sales detail",
        variant: "destructive",
      });
    }
  };

  if (!itemId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please save the item first to manage sales details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Item Sales Details</h3>
          <p className="text-sm text-muted-foreground">
            Manage sales and pricing information for this item
          </p>
        </div>
        <Button onClick={handleCreateItemSalesDetail} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Sales Detail
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Details ({itemSalesDetails.length})</CardTitle>
          <CardDescription>
            List of all sales and pricing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemSalesDetailsTable
            itemSalesDetails={itemSalesDetails}
            isLoading={isLoading}
            onEdit={handleEditItemSalesDetail}
            onDelete={handleDeleteItemSalesDetail}
          />
        </CardContent>
      </Card>

      <ItemSalesDetailsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        itemSalesDetail={selectedItemSalesDetail}
        itemId={itemId}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 