"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCreateItemStockAnalysis, useUpdateItemStockAnalysis } from "@/hooks/items/use-item-stock-analysis";
import { FormInput } from "@/components/shared/forms/form-input";
import { RightDrawer } from "@/components/shared/right-drawer";

const itemStockAnalysisSchema = z.object({
  itemId: z.number().min(1, "Item ID is required"),
  currentStock: z.number().min(0, "Current stock must be positive"),
  minimumStock: z.number().min(0, "Minimum stock must be positive"),
  maximumStock: z.number().min(0, "Maximum stock must be positive"),
  reorderPoint: z.number().min(0, "Reorder point must be positive"),
  averageConsumption: z.number().min(0, "Average consumption must be positive"),
  leadTime: z.number().min(0, "Lead time must be positive"),
  analysisDate: z.string().min(1, "Analysis date is required"),
  isActive: z.boolean().default(true),
});

type ItemStockAnalysisFormData = z.infer<typeof itemStockAnalysisSchema>;

interface ItemStockAnalysisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itemStockAnalysis?: any;
  itemId?: number;
  onSuccess: () => void;
}

export default function ItemStockAnalysisDrawer({
  isOpen,
  onClose,
  itemStockAnalysis,
  itemId,
  onSuccess,
}: ItemStockAnalysisDrawerProps) {
  const { toast } = useToast();
  const createItemStockAnalysisMutation = useCreateItemStockAnalysis();
  const updateItemStockAnalysisMutation = useUpdateItemStockAnalysis();

  const form = useForm<ItemStockAnalysisFormData>({
    resolver: zodResolver(itemStockAnalysisSchema),
    defaultValues: {
      itemId: itemId || 0,
      currentStock: 0,
      minimumStock: 0,
      maximumStock: 0,
      reorderPoint: 0,
      averageConsumption: 0,
      leadTime: 0,
      analysisDate: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (itemStockAnalysis) {
      form.reset({
        itemId: itemStockAnalysis.itemId || itemId || 0,
        currentStock: itemStockAnalysis.currentStock || 0,
        minimumStock: itemStockAnalysis.minimumStock || 0,
        maximumStock: itemStockAnalysis.maximumStock || 0,
        reorderPoint: itemStockAnalysis.reorderPoint || 0,
        averageConsumption: itemStockAnalysis.averageConsumption || 0,
        leadTime: itemStockAnalysis.leadTime || 0,
        analysisDate: itemStockAnalysis.analysisDate || "",
        isActive: itemStockAnalysis.isActive ?? true,
      });
    } else {
      form.reset({
        itemId: itemId || 0,
        currentStock: 0,
        minimumStock: 0,
        maximumStock: 0,
        reorderPoint: 0,
        averageConsumption: 0,
        leadTime: 0,
        analysisDate: "",
        isActive: true,
      });
    }
  }, [itemStockAnalysis, itemId, form]);

  const onSubmit = async (data: ItemStockAnalysisFormData) => {
    try {
      if (itemStockAnalysis) {
        await updateItemStockAnalysisMutation.mutateAsync({
          id: itemStockAnalysis.id,
          data,
        });
        toast({
          title: "Success",
          description: "Item stock analysis updated successfully",
        });
      } else {
        await createItemStockAnalysisMutation.mutateAsync(data);
        toast({
          title: "Success",
          description: "Item stock analysis created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: itemStockAnalysis 
          ? "Failed to update item stock analysis" 
          : "Failed to create item stock analysis",
        variant: "destructive",
      });
    }
  };

  const isLoading = createItemStockAnalysisMutation.isPending || updateItemStockAnalysisMutation.isPending;

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={itemStockAnalysis ? "Edit Item Stock Analysis" : "Create New Item Stock Analysis"}
      description={itemStockAnalysis 
        ? "Update the item stock analysis information below." 
        : "Fill in the information below to create a new item stock analysis."
      }
    >
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="currentStock"
              label="Current Stock"
              placeholder="Enter current stock level"
              inputProps={{ type: "number", min: "0" }}
              required
            />

            <FormInput
              control={form.control}
              name="minimumStock"
              label="Minimum Stock"
              placeholder="Enter minimum stock level"
              inputProps={{ type: "number", min: "0" }}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="maximumStock"
              label="Maximum Stock"
              placeholder="Enter maximum stock level"
              inputProps={{ type: "number", min: "0" }}
              required
            />

            <FormInput
              control={form.control}
              name="reorderPoint"
              label="Reorder Point"
              placeholder="Enter reorder point"
              inputProps={{ type: "number", min: "0" }}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="averageConsumption"
              label="Average Consumption"
              placeholder="Enter average consumption per day"
              inputProps={{ type: "number", step: "0.01", min: "0" }}
              required
            />

            <FormInput
              control={form.control}
              name="leadTime"
              label="Lead Time (days)"
              placeholder="Enter lead time in days"
              inputProps={{ type: "number", min: "0" }}
              required
            />
          </div>

          <FormInput
            control={form.control}
            name="analysisDate"
            label="Analysis Date"
            placeholder="YYYY-MM-DD"
            inputProps={{ type: "date" }}
            required
          />

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Active Status</label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this stock analysis
              </p>
            </div>
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : itemStockAnalysis ? "Update Stock Analysis" : "Create Stock Analysis"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </RightDrawer>
  );
} 