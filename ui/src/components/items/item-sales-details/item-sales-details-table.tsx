"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/types/common";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable from "../../shared/advanced-table";
import { ItemSalesDetail } from "@/hooks/items/use-item-sales-details";

interface ItemSalesDetailsTableProps {
  itemSalesDetails: ItemSalesDetail[];
  onEdit: (detail: ItemSalesDetail) => void;
  onDelete: (detail: ItemSalesDetail) => void;
  isLoading?: boolean;
}

export default function ItemSalesDetailsTable({
  itemSalesDetails,
  onEdit,
  onDelete,
  isLoading,
}: ItemSalesDetailsTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { name: 'salesPrice', data_type: 'number', description: 'Sales Price' },
    { name: 'costPrice', data_type: 'number', description: 'Cost Price' },
    { name: 'margin', data_type: 'number', description: 'Margin' },
    { name: 'currency', data_type: 'string', description: 'Currency' },
    { name: 'effectiveDate', data_type: 'date', description: 'Effective Date' },
    { name: 'expiryDate', data_type: 'date', description: 'Expiry Date' },
    { name: 'isActive', data_type: 'boolean', description: 'Active' },
    { name: 'createdByName', data_type: 'string', description: 'Created By' },
    { name: 'createdAt', data_type: 'date', description: 'Created At' },
  ], []);
  
  const defaultColumns = [
    'salesPrice',
    'costPrice',
    'margin',
    'currency',
    'effectiveDate',
    'expiryDate',
    'isActive',
  ];

  // Transform data for better display
  const transformedData = useMemo(() => {
    return itemSalesDetails.map(detail => ({
      ...detail,
      salesPrice: `$${detail.salesPrice.toFixed(2)}`,
      costPrice: `$${detail.costPrice.toFixed(2)}`,
      margin: `${detail.margin.toFixed(2)}%`,
      effectiveDate: detail.effectiveDate ? formatDate(detail.effectiveDate) : '',
      expiryDate: detail.expiryDate ? formatDate(detail.expiryDate) : '',
      createdAt: detail.createdAt ? formatDate(detail.createdAt) : '',
      isActive: detail.isActive ? 'Yes' : 'No',
    }));
  }, [itemSalesDetails]);

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