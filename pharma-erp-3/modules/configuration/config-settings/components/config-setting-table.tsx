'use client';

import { DataTable, createActionColumn } from '@/components/shared/data-table';
import { ConfigSetting } from '../types';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

interface ConfigSettingTableProps {
  configSettings: ConfigSetting[];
  isLoading: boolean;
  onEdit: (configSetting: ConfigSetting) => void;
  onView: (configSetting: ConfigSetting) => void;
  onDelete: (configSetting: ConfigSetting) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function ConfigSettingTable({
  configSettings,
  isLoading,
  onEdit,
  onView,
  onDelete,
  onCreate,
  totalCount,
  pageCount,
  onPaginationChange,
  currentPagination,
}: ConfigSettingTableProps) {
  const columns = [
    {
      accessorKey: 'settingKey',
      header: 'Setting Key',
      cell: ({ row }: any) => (
        <div className="font-medium font-mono text-sm">{row.original.settingKey}</div>
      ),
    },
    {
      accessorKey: 'settingName',
      header: 'Setting Name',
      cell: ({ row }: any) => (
        <div className="max-w-[250px] truncate">{row.original.settingName}</div>
      ),
    },
    {
      accessorKey: 'stringValue',
      header: 'String Value',
      cell: ({ row }: any) => (
        <div className="text-muted-foreground text-sm">{row.original.stringValue || '-'}</div>
      ),
    },
    {
      accessorKey: 'integerValue',
      header: 'Integer Value',
      cell: ({ row }: any) => (
        <div className="text-muted-foreground text-sm">{row.original.integerValue ?? '-'}</div>
      ),
    },
    {
      accessorKey: 'booleanValue',
      header: 'Boolean Value',
      cell: ({ row }: any) => (
        <div className="text-muted-foreground text-sm">{row.original.booleanValue !== undefined ? String(row.original.booleanValue) : '-'}</div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    createActionColumn<ConfigSetting>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      columns={columns}
      data={configSettings}
      loading={isLoading}
      totalCount={totalCount}
      pageCount={pageCount}
      initialPagination={currentPagination}
      onPaginationChange={onPaginationChange}
      headerActions={[{
        label: 'Create Config Setting',
        onClick: onCreate,
        icon: Settings,
      }]}
    />
  );
}

