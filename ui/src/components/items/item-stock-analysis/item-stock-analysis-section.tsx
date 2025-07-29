"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useItemStockAnalysisByItemId } from "@/hooks/items/use-item-stock-analysis";
import ItemStockAnalysisTable from "./item-stock-analysis-table";
import ItemStockAnalysisDrawer from "./item-stock-analysis-drawer";

interface ItemStockAnalysisSectionProps {
  itemId?: number;
}

export default function ItemStockAnalysisSection({ itemId }: ItemStockAnalysisSectionProps) {
  const { toast } = useToast();
  const { data: itemStockAnalysis = [], isLoading, refetch } = useItemStockAnalysisByItemId(itemId || 0);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItemStockAnalysis, setSelectedItemStockAnalysis] = useState<any>(null);

  const handleCreateItemStockAnalysis = () => {
    setSelectedItemStockAnalysis(null);
    setDrawerOpen(true);
  };

  const handleEditItemStockAnalysis = (analysis: any) => {
    setSelectedItemStockAnalysis(analysis);
    setDrawerOpen(true);
  };

  const handleDeleteItemStockAnalysis = async (id: number) => {
    if (!confirm("Are you sure you want to delete this stock analysis?")) return;

    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "Item stock analysis deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item stock analysis",
        variant: "destructive",
      });
    }
  };

  if (!itemId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please save the item first to manage stock analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Item Stock Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Analyze stock levels and movements for this item
          </p>
        </div>
        <Button onClick={handleCreateItemStockAnalysis} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Stock Analysis
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Analysis ({itemStockAnalysis.length})</CardTitle>
          <CardDescription>
            List of all stock analysis records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemStockAnalysisTable
            itemStockAnalysis={itemStockAnalysis}
            isLoading={isLoading}
            onEdit={handleEditItemStockAnalysis}
            onDelete={handleDeleteItemStockAnalysis}
          />
        </CardContent>
      </Card>

      <ItemStockAnalysisDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        itemStockAnalysis={selectedItemStockAnalysis}
        itemId={itemId}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </div>
  );
} 