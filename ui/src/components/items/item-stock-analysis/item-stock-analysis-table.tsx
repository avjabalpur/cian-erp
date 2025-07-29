"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/types/common";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable from "../../shared/advanced-table";
import { ItemStockAnalysis } from "@/hooks/items/use-item-stock-analysis";

interface ItemStockAnalysisTableProps {
  itemStockAnalysis: ItemStockAnalysis[];
  onEdit: (analysis: ItemStockAnalysis) => void;
  onDelete: (analysis: ItemStockAnalysis) => void;
  isLoading?: boolean;
}

export default function ItemStockAnalysisTable({
  itemStockAnalysis,
  onEdit,
  onDelete,
  isLoading,
}: ItemStockAnalysisTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { name: 'currentStock', data_type: 'number', description: 'Current Stock' },
    { name: 'minimumStock', data_type: 'number', description: 'Minimum Stock' },
    { name: 'maximumStock', data_type: 'number', description: 'Maximum Stock' },
    { name: 'reorderPoint', data_type: 'number', description: 'Reorder Point' },
    { name: 'averageConsumption', data_type: 'number', description: 'Average Consumption' },
    { name: 'leadTime', data_type: 'number', description: 'Lead Time' },
    { name: 'analysisDate', data_type: 'date', description: 'Analysis Date' },
    { name: 'isActive', data_type: 'boolean', description: 'Active' },
    { name: 'createdByName', data_type: 'string', description: 'Created By' },
    { name: 'createdAt', data_type: 'date', description: 'Created At' },
  ], []);
  
  const defaultColumns = [
    'currentStock',
    'minimumStock',
    'maximumStock',
    'reorderPoint',
    'averageConsumption',
    'leadTime',
    'analysisDate',
    'isActive',
  ];

  // Transform data for better display
  const transformedData = useMemo(() => {
    return itemStockAnalysis.map(analysis => ({
      ...analysis,
      currentStock: analysis.currentStock.toString(),
      minimumStock: analysis.minimumStock.toString(),
      maximumStock: analysis.maximumStock.toString(),
      reorderPoint: analysis.reorderPoint.toString(),
      averageConsumption: analysis.averageConsumption.toString(),
      leadTime: `${analysis.leadTime} days`,
      analysisDate: analysis.analysisDate ? formatDate(analysis.analysisDate) : '',
      createdAt: analysis.createdAt ? formatDate(analysis.createdAt) : '',
      isActive: analysis.isActive ? 'Yes' : 'No',
    }));
  }, [itemStockAnalysis]);

  const actionButtons = {
    onEdit: onEdit,
    onDelete: onDelete,
    customActions: [
      {
        label: 'Edit',
        icon: Edit,
        onClick: onEdit,
        variant: 'outline' as const,
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: onDelete,
        variant: 'destructive' as const,
      },
    ]
  };

  return (
    <div className="w-full">
      <AdvancedTable
        data={transformedData}
        columns={defaultColumns}
        columnMeta={columnMeta}
        isLoading={isLoading}
        groupingEnabled={false}
        globalFilterEnabled={true}
        dragDropGroupingEnabled={false}
        onRowClick={onEdit}
        actionButtons={actionButtons}
        className="w-full"
      />
    </div>
  );
} 