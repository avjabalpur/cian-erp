import React, { useMemo, useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { exportToCSV } from './export-utils';
import { getColumnTypeFromDataType, guessColumnTypeFromValue, FilterType } from './column-utils';
import { Column as ColumnMeta, CellRenderer } from './types';
import { DragDropGrouping } from './drag-drop-grouping';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DebouncedInput } from '@/components/shared/debounced-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronUp, ChevronDown, ChevronRight, Download, Search, Filter, Layers, Columns, Maximize2, Minimize2, Trash2, Mail } from 'lucide-react';

interface TanstackTableWrapperProps {
  data: any[];
  columns?: string[]; // If not provided, use keys from first data row
  columnMeta?: ColumnMeta[]; // Optional metadata for columns
  isLoading?: boolean;
  groupingEnabled?: boolean;
  globalFilterEnabled?: boolean;
  dragDropGroupingEnabled?: boolean;
  className?: string;
  onRowClick?: (row: any) => void;
  actionButtons?: {
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    onView?: (row: any) => void;
  };
  // Multiple selection props
  enableRowSelection?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  rowIdField?: string;
  // Bulk actions
  bulkActions?: {
    onBulkEmail?: (selectedRows: any[]) => void;
    onBulkDelete?: (selectedIds: string[]) => void;
  };
  // Server-side pagination props
  pageCount?: number;
  pageSize?: number;
  pageIndex?: number;
  totalCount?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  manualPagination?: boolean;
  // Server-side filtering and sorting props
  onGlobalFilterChange?: (filter: string) => void;
  onColumnFiltersChange?: (filters: any[]) => void;
  onSortingChange?: (sorting: any[]) => void;
  manualFiltering?: boolean;
  manualSorting?: boolean;
}

const TanstackTableWrapper: React.FC<TanstackTableWrapperProps> = ({
  data,
  columns,
  columnMeta,
  isLoading = false,
  groupingEnabled = true,
  globalFilterEnabled = true,
  dragDropGroupingEnabled = true,
  className = '',
  onRowClick,
  actionButtons,
  // Multiple selection props
  enableRowSelection = false,
  selectedRows: externalSelectedRows,
  onSelectionChange,
  rowIdField = 'id',
  // Bulk actions
  bulkActions,
  // Server-side pagination props
  pageCount,
  pageSize: externalPageSize,
  pageIndex: externalPageIndex,
  totalCount,
  onPaginationChange,
  manualPagination = false,
  // Server-side filtering and sorting props
  onGlobalFilterChange,
  onColumnFiltersChange,
  onSortingChange,
  manualFiltering = false,
  manualSorting = false,
}) => {
  const [sorting, setSorting] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [grouping, setGrouping] = useState<string[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<any>({});
  const [pagination, setPagination] = useState({
    pageIndex: externalPageIndex ?? 0,
    pageSize: externalPageSize ?? 20,
  });
  const [selected, setSelected] = useState<string[]>([]);

  // Update internal pagination when external props change
  useEffect(() => {
    if (manualPagination && externalPageIndex !== undefined && externalPageSize !== undefined) {
      setPagination({
        pageIndex: externalPageIndex,
        pageSize: externalPageSize,
      });
    }
  }, [externalPageIndex, externalPageSize, manualPagination]);

  // Update internal selection when external props change
  useEffect(() => {
    if (externalSelectedRows !== undefined) {
      setSelected(externalSelectedRows);
    }
  }, [externalSelectedRows]);

  // Determine column types using metadata or data
  const tableColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    const keys = columns || Object.keys(data[0]);
    
    // Add selection column if enabled
    const allColumns = enableRowSelection ? ['selection', ...keys] : keys;
    
    const dataColumns = allColumns.map((key) => {
      // Handle selection column
      if (key === 'selection') {
        return {
          accessorKey: 'selection',
          header: () => (
            <Checkbox
              className="w-4 h-4 pr-1.5"
              checked={selected.length > 0 && selected.length === data.length}
              onCheckedChange={(checked) => {
                const allIds = data.map(row => row[rowIdField]);
                setSelected(checked ? allIds : []);
                if (onSelectionChange) {
                  onSelectionChange(checked ? allIds : []);
                }
              }}
              disabled={isLoading}
            />
          ),
          description: 'Row selection',
          meta: { type: 'unknown' as FilterType },
          enableSorting: false,
          enableColumnFilter: false,
          enableGrouping: false,
          cell: (info: any) => {
            const row = info.row.original;
            return (
              <Checkbox
                checked={selected.includes(row[rowIdField])}
                onCheckedChange={(checked) => {
                  const newSelected = checked
                    ? [...selected, row[rowIdField]]
                    : selected.filter(id => id !== row[rowIdField]);
                  setSelected(newSelected);
                  if (onSelectionChange) {
                    onSelectionChange(newSelected);
                  }
                }}
                disabled={isLoading}
              />
            );
          },
        };
      }

      let type: FilterType = 'string';
      let description = '';
      let customRenderer: CellRenderer | undefined;
      let displayName: string | undefined;
      
      if (columnMeta) {
        const meta = columnMeta.find((c) => c.name === key);
        if (meta) {
          type = getColumnTypeFromDataType(meta.data_type);
          description = meta.description || '';
          customRenderer = meta.render;
          displayName = meta.displayName;
        }
      } else {
        // Guess type from first value
        type = guessColumnTypeFromValue(data[0][key]);
      }
      
      return {
        accessorKey: key,
        header: displayName || key,
         description,
         meta: { type: type as FilterType },
         enableSorting: true,
         enableColumnFilter: true,
         enableGrouping: groupingEnabled,
        cell: (info: any) => {
          const value = info.getValue();
          const row = info.row.original;
          
          // Use custom renderer if available
          if (customRenderer) {
            return customRenderer(value, row);
          }
          
          // Default rendering based on type
          if (type === 'boolean') return value ? '✔️' : '';
          if (type === 'date') return value ? new Date(value).toLocaleString() : '';
          if (typeof value === 'object' && value !== null) return JSON.stringify(value);
          return String(value ?? '');
        },
        filterFn: (row: any, columnId: string, filterValue: any) => {
          const val = row.getValue(columnId);
          if (type === 'number') {
            if (filterValue.op === '=') return Number(val) === Number(filterValue.value);
            if (filterValue.op === '>') return Number(val) > Number(filterValue.value);
            if (filterValue.op === '<') return Number(val) < Number(filterValue.value);
            if (filterValue.op === '>=') return Number(val) >= Number(filterValue.value);
            if (filterValue.op === '<=') return Number(val) <= Number(filterValue.value);
            return true;
          }
          if (type === 'boolean') {
            return String(val) === String(filterValue.value);
          }
          if (type === 'date') {
            // Simple string match or date equality
            return new Date(val).toLocaleDateString().includes(filterValue.value);
          }
          // Default: string includes
          return String(val ?? '').toLowerCase().includes(String(filterValue.value ?? '').toLowerCase());
        },
      };
    });

    // Add action buttons column if provided (but exclude delete for individual rows when bulk delete is enabled)
    if (actionButtons && (actionButtons.onEdit || actionButtons.onView || actionButtons.onDelete)) {
      dataColumns.push({
        accessorKey: 'actions',
        header: 'Actions',
        description: 'Row actions',
        meta: { type: 'unknown' as FilterType },
        enableSorting: false,
        enableColumnFilter: false,
        enableGrouping: false,
        filterFn: () => true, // Actions column is not filterable
        cell: (info: any): any => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-1">
              {actionButtons.onView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actionButtons.onView!(row);
                  }}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  View
                </button>
              )}
              {actionButtons.onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actionButtons.onEdit!(row);
                  }}
                  className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
                >
                  Edit
                </button>
              )}
              {actionButtons.onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actionButtons.onDelete!(row);
                  }}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          );
        },
      });
    }

    return dataColumns;
  }, [data, columns, columnMeta, groupingEnabled, actionButtons, enableRowSelection, selected, onSelectionChange, rowIdField, isLoading]);

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Initialize column visibility when data or columns change
  useEffect(() => {
    if (data && data.length > 0) {
      const keys = columns || Object.keys(data[0]);
      // Add selection column to visibility if row selection is enabled
      const allKeys = enableRowSelection ? ['selection', ...keys] : keys;
      const initialVisibility = Object.fromEntries(allKeys.map(k => [k, true]));
      setColumnVisibility(prev => {
        // Only update if the keys have actually changed
        const prevKeys = Object.keys(prev);
        const newKeys = allKeys;
        if (prevKeys.length !== newKeys.length || !prevKeys.every(key => newKeys.includes(key))) {
          return initialVisibility;
        }
        return prev;
      });
    }
  }, [data, columns, enableRowSelection]);

  // Prepare columns for drag and drop component
  const dragDropColumns = useMemo(() => {
    return tableColumns.map(col => ({
      id: col.accessorKey as string,
      header: col.header as string,
      description: col.description || '',
    }));
  }, [tableColumns]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
      grouping,
      columnFilters,
      columnVisibility,
      expanded,
      pagination,
    },
    onSortingChange: manualSorting ?
      (updater) => {
        const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
        setSorting(newSorting);
        if (onSortingChange) {
          onSortingChange(newSorting);
        }
      } : setSorting,
    onGlobalFilterChange: manualFiltering ?
      (filter) => {
        setGlobalFilter(filter);
        if (onGlobalFilterChange) {
          onGlobalFilterChange(filter);
        }
      } : setGlobalFilter,
    onGroupingChange: setGrouping,
    onColumnFiltersChange: manualFiltering ?
      (updater) => {
        const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
        setColumnFilters(newFilters);
        if (onColumnFiltersChange) {
          onColumnFiltersChange(newFilters);
        }
      } : setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onPaginationChange: manualPagination ?
      (updater) => {
        const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
        setPagination(newPagination);
        if (onPaginationChange) {
          onPaginationChange(newPagination.pageIndex, newPagination.pageSize);
        }
      } : setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: manualPagination,
    pageCount: manualPagination ? pageCount : undefined,
    manualFiltering: manualFiltering,
    manualSorting: manualSorting,
    debugTable: false,
  });

  return (
    <Card className={`${className} border-gray-200 shadow-sm`}>
      <CardHeader className="bg-white border-b border-gray-200 rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Filter className="h-5 w-5 text-gray-600" />
            Results
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              {table.getFilteredRowModel().rows.length} rows
            </Badge>
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bulk Action Buttons */}
            {bulkActions && selected.length > 0 && (
              <div className="flex items-center gap-2 mr-4">
                {bulkActions.onBulkEmail && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const selectedData = data.filter(row => selected.includes(row[rowIdField]))
                      bulkActions.onBulkEmail!(selectedData)
                    }}
                    disabled={isLoading}
                    className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email ({selected.length})
                  </Button>
                )}
                {bulkActions.onBulkDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => bulkActions.onBulkDelete!(selected)}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selected.length})
                  </Button>
                )}
              </div>
            )}

            {globalFilterEnabled && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <DebouncedInput
                  className="pl-9 w-64"
                  value={globalFilter ?? ''}
                  onChange={(value) => {
                    setGlobalFilter(value);
                    if (manualFiltering && onGlobalFilterChange) {
                      onGlobalFilterChange(value);
                    }
                  }}
                  placeholder="Search all columns..."
                  disabled={isLoading}
                  delay={500}
                />
              </div>
            )}

            {/* Column Visibility Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading}>
                  <Columns className="h-4 w-4 mr-2" />
                  Columns
                  <Badge variant="secondary" className="ml-2">
                    {table.getVisibleLeafColumns().length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table.getAllLeafColumns().map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(checked) => column.toggleVisibility(checked)}
                    disabled={isLoading}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(
                table.getFilteredRowModel().rows.map(r => r.original),
                tableColumns.filter(c => c.accessorKey && columnVisibility[c.accessorKey] !== false).map(c => String(c.accessorKey || ''))
              )}
              disabled={isLoading || table.getFilteredRowModel().rows.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

      </CardHeader>

      {/* Drag and Drop Grouping */}
      {dragDropGroupingEnabled && groupingEnabled && (
        <CardContent className="pt-0">
          <DragDropGrouping
            availableColumns={dragDropColumns}
            groupedColumns={grouping}
            onGroupingChange={setGrouping}
          />
        </CardContent>
      )}

      <CardContent className="p-0">
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Table className="border-separate border-spacing-0">
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
                  {headerGroup.headers.map(header => (
                    <TableHead 
                      key={header.id} 
                      className="relative px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200 last:border-r-0 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className="flex items-center gap-2 cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler?.()}
                      >
                        <span className="text-sm font-semibold text-gray-700">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4 text-blue-600" />}
                        {header.column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4 text-blue-600" />}
                      </div>
                      {/* {header.column.getCanFilter() && (() => {
                        const type: FilterType = (header.column.columnDef.meta && (header.column.columnDef.meta as { type?: FilterType }).type) || 'string';
                        const filterVal = header.column.getFilterValue();

                        if (type === 'number') {
                          return (
                            <div className="flex gap-1 mt-2">
                              <Select
                                value={(filterVal as { op?: string })?.op || '='}
                                onValueChange={value => header.column.setFilterValue({ ...(filterVal as { op?: string; value?: string | number }), op: value })}
                                disabled={isLoading}
                              >
                                <SelectTrigger className="w-16 h-7 text-xs border-gray-300 focus:border-blue-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="=">=</SelectItem>
                                  <SelectItem value=">">&gt;</SelectItem>
                                  <SelectItem value="<">&lt;</SelectItem>
                                  <SelectItem value=">=">&ge;</SelectItem>
                                  <SelectItem value="<=">&le;</SelectItem>
                                </SelectContent>
                              </Select>
                              <DebouncedInput
                                className="h-7 text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                type="number"
                                value={(filterVal as { value?: string | number })?.value?.toString() ?? ''}
                                onChange={(value) => {
                                  const newFilterVal = { ...(filterVal as { op?: string; value?: string | number }), value };
                                  header.column.setFilterValue(newFilterVal);
                                  if (manualFiltering && onColumnFiltersChange) {
                                    const currentFilters = table.getState().columnFilters;
                                    const newFilters = currentFilters.filter(f => f.id !== header.column.id);
                                    if (value && value.trim() !== '') {
                                      newFilters.push({ id: header.column.id, value: `${newFilterVal.op || '='}:${value}` });
                                    }
                                    onColumnFiltersChange(newFilters);
                                  }
                                }}
                                placeholder="Number..."
                                disabled={isLoading}
                                delay={500}
                              />
                            </div>
                          );
                        }

                        if (type === 'boolean') {
                          return (
                            <Select
                              value={(filterVal as { value?: string | number })?.value?.toString() ?? 'ANY'}
                              onValueChange={value => header.column.setFilterValue({ value: value === 'ANY' ? '' : value })}
                              disabled={isLoading}
                            >
                              <SelectTrigger className="w-full h-7 mt-2 text-xs border-gray-300 focus:border-blue-500">
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ANY">Any</SelectItem>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                              </SelectContent>
                            </Select>
                          );
                        }

                        if (type === 'date') {
                          return (
                            <DebouncedInput
                              className="h-7 mt-2 text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              type="date"
                              value={(filterVal as { value?: string | number })?.value?.toString() ?? ''}
                              onChange={(value) => {
                                header.column.setFilterValue({ value });
                                if (manualFiltering && onColumnFiltersChange) {
                                  const currentFilters = table.getState().columnFilters;
                                  const newFilters = currentFilters.filter(f => f.id !== header.column.id);
                                  if (value && value.trim() !== '') {
                                    newFilters.push({ id: header.column.id, value });
                                  }
                                  onColumnFiltersChange(newFilters);
                                }
                              }}
                              disabled={isLoading}
                              delay={500}
                            />
                          );
                        }

                        // Default: string filter
                        return (
                          <DebouncedInput
                            className="h-7 mt-2 text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={(filterVal as { value?: string | number })?.value?.toString() ?? ''}
                            onChange={(value) => {
                              header.column.setFilterValue({ value });
                              if (manualFiltering && onColumnFiltersChange) {
                                // Trigger server-side filter update
                                const currentFilters = table.getState().columnFilters;
                                const newFilters = currentFilters.filter(f => f.id !== header.column.id);
                                if (value && value.trim() !== '') {
                                  newFilters.push({ id: header.column.id, value });
                                }
                                onColumnFiltersChange(newFilters);
                              }
                            }}
                            placeholder="Filter..."
                            disabled={isLoading}
                            delay={500}
                          />
                        );
                      })()} */}

                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center text-gray-500"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        Loading...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Filter className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">No results found</p>
                          <p className="text-sm text-gray-400">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map(row => {
                if (row.getIsGrouped()) {
                  // This is a grouped row (could be at any level)
                  const groupDepth = row.depth;
                  const isTopLevel = groupDepth === 0;
                  
                  // Get the grouping column for this level
                  const groupingColumn = grouping[groupDepth] || 'unknown';
                  const groupValue = row.getValue(groupingColumn);
                  
                  return (
                    <TableRow 
                      key={row.id} 
                      className={
                        isTopLevel 
                          ? "bg-blue-50 border-b border-gray-200 hover:bg-blue-100 transition-colors"
                          : "bg-blue-25 border-b border-gray-100 hover:bg-blue-75 transition-colors"
                      }
                    >
                      <TableCell colSpan={row.getVisibleCells().length} className="px-4 py-2 border-r border-gray-200 last:border-r-0">
                        <div 
                          className="flex items-center gap-3"
                          style={{ paddingLeft: `${groupDepth * 16}px` }}
                        >
                          <button
                            onClick={() => row.toggleExpanded()}
                            className="p-1 hover:bg-blue-200 rounded transition-colors flex items-center justify-center"
                            title={row.getIsExpanded() ? 'Collapse group' : 'Expand group'}
                          >
                            {row.getIsExpanded() ? (
                              <ChevronDown className="h-3 w-3 text-blue-600" />
                            ) : (
                              <ChevronRight className="h-3 w-3 text-blue-600" />
                            )}
                          </button>
                          <div className="flex items-center gap-2 flex-1">
                            <span className={`font-medium ${isTopLevel ? 'text-gray-800' : 'text-gray-700'} text-sm`}>
                              <span className="text-gray-500 text-xs mr-2 uppercase tracking-wide">
                                {groupingColumn}:
                              </span>
                              {String(groupValue ?? '(No value)')}
                            </span>
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
                            >
                              {row.subRows.length}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  // This is a regular data row
                  return (
                    <TableRow
                      key={row.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell 
                          key={cell.id}
                          className="px-4 py-2 border-r border-gray-100 last:border-r-0 text-sm text-gray-900"
                          style={
                            index === 0 && row.depth > 0 
                              ? { paddingLeft: `${(row.depth * 16) + 16}px` } 
                              : {}
                          }
                        >
                          <div className="truncate">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                }
              })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Legacy Grouping Controls - only show if drag and drop is disabled */}
        {groupingEnabled && !dragDropGroupingEnabled && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Group by:</span>
              {tableColumns.map(col => (
                <Badge
                  key={col.accessorKey as string}
                  variant={grouping.includes(col.accessorKey as string) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setGrouping(prev =>
                      prev.includes(col.accessorKey as string)
                        ? prev.filter(g => g !== col.accessorKey)
                        : [...prev, col.accessorKey as string]
                    );
                  }}
                >
                  {col.header as string}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Grouping Status */}
        {groupingEnabled && grouping.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-800">
                Grouped by: {grouping.join(' → ')}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.toggleAllRowsExpanded(true)}
                  disabled={isLoading}
                  className="h-7 text-xs border-gray-300 hover:bg-gray-100"
                >
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Expand All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.toggleAllRowsExpanded(false)}
                  disabled={isLoading}
                  className="h-7 text-xs border-gray-300 hover:bg-gray-100"
                >
                  <Minimize2 className="h-3 w-3 mr-1" />
                  Collapse All
                </Button>
                <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                  {table.getGroupedRowModel().rows.length} {grouping.length > 1 ? 'top-level ' : ''}groups
                </Badge>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {grouping.length > 1 ? (
                <>Multi-level grouping: Click expand icons to drill down through {grouping.length} levels</>
              ) : (
                <>Click expand/collapse icons next to group headers to show/hide contents</>
              )}
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 bg-gray-50 px-4 py-3 rounded-b-lg">
          <div className="text-sm text-gray-600">
            {manualPagination ? (
              // Server-side pagination display
              <>
                {totalCount === 0 ? (
                  "No results found"
                ) : (
                  <>Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalCount || 0)} of {totalCount || 0} results</>
                )}
              </>
            ) : (
              // Client-side pagination display
              <>
                {table.getFilteredRowModel().rows.length === 0 ? (
                  "No results found"
                ) : (
                  <>Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} results</>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 text-xs border-gray-300 hover:bg-gray-100"
            >
              First
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 text-xs border-gray-300 hover:bg-gray-100"
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page</span>
              <Input
                type="number"
                min="1"
                max={manualPagination ? (pageCount || 0) : table.getPageCount()}
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-16 h-8 text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">of {manualPagination ? (pageCount || 0) : table.getPageCount()}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 text-xs border-gray-300 hover:bg-gray-100"
            >
              Next
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 text-xs border-gray-300 hover:bg-gray-100"
            >
              Last
            </Button>

            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={value => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20 h-8 text-xs border-gray-300 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100, 200].map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm text-gray-600">
              rows per page
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TanstackTableWrapper;
