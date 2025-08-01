"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/components/shared/advanced-table/types";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable from "../shared/advanced-table";
import { ConfigSetting } from "@/types/config-setting";

interface ConfigSettingTableProps {
  configSettings: ConfigSetting[];
  onEdit: (configSetting: ConfigSetting) => void;
  onDelete?: (configSetting: ConfigSetting) => void;
  isLoading?: boolean;
  // Server-side operations
  onGlobalFilterChange?: (filter: string) => void;
  onColumnFiltersChange?: (filters: any[]) => void;
  onSortingChange?: (sorting: any[]) => void;
  // Pagination
  pageCount?: number;
  pageSize?: number;
  pageIndex?: number;
  totalCount?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export default function ConfigSettingTable({
  configSettings,
  onEdit,
  onDelete,
  isLoading,
  onGlobalFilterChange,
  onColumnFiltersChange,
  onSortingChange,
  pageCount,
  pageSize,
  pageIndex,
  totalCount,
  onPaginationChange,
}: ConfigSettingTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { 
      name: 'settingKey', 
      data_type: 'string', 
      displayName: 'Setting Key',
      isDefault: true
    },
    { 
      name: 'settingName', 
      data_type: 'string', 
      displayName: 'Setting Name',
      isDefault: true
    },
    { 
      name: 'description', 
      data_type: 'string', 
      displayName: 'Description',
      isDefault: true
    },
    { 
      name: 'stringValue', 
      data_type: 'string', 
      displayName: 'String Value',
      isDefault: true
    },
    { 
      name: 'integerValue', 
      data_type: 'number', 
      displayName: 'Integer Value',
      isDefault: false
    },
    { 
      name: 'booleanValue', 
      data_type: 'boolean', 
      displayName: 'Boolean Value',
      isDefault: false
    },
    { 
      name: 'decimalValue', 
      data_type: 'number', 
      displayName: 'Decimal Value',
      isDefault: false
    },
    { 
      name: 'defaultValue', 
      data_type: 'string', 
      displayName: 'Default Value',
      isDefault: false
    },
    { 
      name: 'isActive', 
      data_type: 'boolean', 
      displayName: 'Status',
      isDefault: true
    },
    { 
      name: 'createdAt', 
      data_type: 'date', 
      displayName: 'Created At',
      isDefault: false
    },
  ], []);
  
  // Transform data for better display
  const transformedData = useMemo(() => {
    return configSettings.map(configSetting => ({
      ...configSetting,
      isActive: configSetting.isActive ? 'Active' : 'Inactive',
      description: configSetting.description || 'N/A',
      stringValue: configSetting.stringValue || 'N/A',
      integerValue: configSetting.integerValue || 'N/A',
      booleanValue: configSetting.booleanValue !== null ? (configSetting.booleanValue ? 'Yes' : 'No') : 'N/A',
      decimalValue: configSetting.decimalValue || 'N/A',
      defaultValue: configSetting.defaultValue || 'N/A',
      createdAt: configSetting.createdAt ? formatDate(configSetting.createdAt) : 'N/A',
    }));
  }, [configSettings]);

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
      ...(onDelete ? [{
        label: 'Delete',
        icon: Trash2,
        onClick: onDelete,
        variant: 'destructive' as const,
      }] : []),
    ]
  };

  return (
    <div className="w-full">
      <AdvancedTable
        data={transformedData}
        columnMeta={columnMeta}
        isLoading={isLoading}
        groupingEnabled={false}
        globalFilterEnabled={false}
        dragDropGroupingEnabled={false}
        onRowClick={onEdit}
        actionButtons={actionButtons}
        className="w-full"
        // Server-side pagination
        manualPagination={!!onPaginationChange}
        pageCount={pageCount}
        pageSize={pageSize}
        pageIndex={pageIndex}
        totalCount={totalCount}
        onPaginationChange={onPaginationChange}
        // Server-side filtering and sorting
        manualFiltering={false}
        manualSorting={true}
        onGlobalFilterChange={onGlobalFilterChange}
        onColumnFiltersChange={onColumnFiltersChange}
        onSortingChange={onSortingChange}
      />
    </div>
  );
} 