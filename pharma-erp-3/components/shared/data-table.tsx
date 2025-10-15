'use client';

/**
 * DataTable Component with Multi-Row Selection Support
 * 
 * Features:
 * - Multi-row selection with checkboxes
 * - Configurable selection actions from parent component
 * - Header checkbox for select all functionality
 * - Selection change callbacks
 * - Alternating row colors for better readability
 * 
 * Usage Example:
 * ```tsx
 * const selectionActions = [
 *   {
 *     label: 'Delete Selected',
 *     onClick: (selectedRows) => handleDelete(selectedRows),
 *     variant: 'destructive' as const,
 *     icon: Trash2,
 *     disabled: (rows) => rows.length === 0
 *   },
 *   {
 *     label: 'Export Selected',
 *     onClick: (selectedRows) => handleExport(selectedRows),
 *     variant: 'outline' as const,
 *     icon: Download
 *   }
 * ];
 * 
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   enableSelection={true}
 *   selectionActions={selectionActions}
 *   onSelectionChange={(selectedRows) => console.log('Selected:', selectedRows)}
 * />
 * ```
 */

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, Download, Edit, Eye, Trash2, Settings, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Check } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface HeaderAction {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

interface SelectionAction<TData = any> {
  label: string;
  onClick: (selectedRows: TData[]) => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: (selectedRows: TData[]) => boolean;
}

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  onRowClick?: (row: TData) => void;
  onExport?: () => void;
  className?: string;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableSelection?: boolean;
  title?: string;
  description?: string;
  headerActions?: HeaderAction[];
  selectionActions?: SelectionAction<TData>[];
  onSelectionChange?: (selectedRows: TData[]) => void;
  // Pagination props
  pageCount?: number;
  totalCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  initialPagination?: PaginationState;
  pageSizeOptions?: number[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  onRowClick,
  onExport,
  className,
  enableColumnVisibility = true,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = false,
  enableSelection = false,
  title,
  description,
  headerActions = [],
  selectionActions = [],
  onSelectionChange,
  pageCount = 0,
  totalCount = 0,
  onPaginationChange,
  initialPagination = { pageIndex: 0, pageSize: 20 },
  pageSizeOptions = [10, 20, 50, 100],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>(initialPagination);

  // Create selection column if enabled
  const selectionColumn = enableSelection ? {
    id: 'select',
    header: ({ table }: any) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="h-4 w-4"
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="h-4 w-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  } : null;

  // Combine selection column with provided columns
  const tableColumns = enableSelection && selectionColumn 
    ? [selectionColumn, ...columns] 
    : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(newSelection);
      
      // Get selected rows and call onSelectionChange
      if (onSelectionChange) {
        const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
        onSelectionChange(selectedRows);
      }
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newPagination);
      onPaginationChange?.(newPagination);
    },
    manualPagination: enablePagination,
    pageCount: enablePagination ? pageCount : undefined,
    enableRowSelection: enableSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: enablePagination ? pagination : undefined,
    },
  });

  const handleExportToExcel = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export functionality
      const headers = table.getAllColumns()
        .filter(column => column.getIsVisible())
        .map(column => column.id);
      
      const rows = table.getRowModel().rows.map(row => 
        headers.map(header => {
          const cell = row.getValue(header);
          return typeof cell === 'object' ? JSON.stringify(cell) : String(cell || '');
        })
      );

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const canPreviousPage = enablePagination ? table.getCanPreviousPage() : false;
  const canNextPage = enablePagination ? table.getCanNextPage() : false;
  const currentPage = enablePagination ? table.getState().pagination.pageIndex : 0;
  const totalPages = enablePagination ? table.getPageCount() : 0;

  return (
    <div className={cn('w-full min-w-0 h-full flex flex-col', className)}>
      {/* Table Header with Title and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {/* Selection Actions */}
          {enableSelection && Object.keys(rowSelection).length > 0 && (
            <>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
                {Object.keys(rowSelection).length} Selected
              </div>
              {selectionActions.map((action, index) => {
                const Icon = action.icon;
                const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
                const isDisabled = action.disabled ? action.disabled(selectedRows) : false;
                
                return (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    size={action.size || 'sm'}
                    onClick={() => action.onClick(selectedRows)}
                    disabled={isDisabled}
                    className={cn("h-8 px-3", action.className)}
                  >
                    {Icon && <Icon className="h-4 w-4 mr-1.5" />}
                    {action.label}
                  </Button>
                );
              })}
            </>
          )}
          
          {/* Custom Header Actions */}
          {headerActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size={action.size || 'sm'}
                onClick={action.onClick}
                className={cn("h-8 px-3", action.className)}
              >
                {Icon && <Icon className="h-4 w-4 mr-1.5" />}
                {action.label}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportToExcel}
            className="h-8 px-3"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3">
                  <Settings className="h-4 w-4 mr-1.5" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg mt-2 border border-gray-200 bg-white shadow-sm w-full flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-gray-200 hover:bg-gray-50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="px-2 py-2 text-left font-medium text-gray-700 text-sm">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`} className={cn("border-b border-gray-100", index % 2 === 0 ? "bg-white" : "bg-gray-50/30")}>
                    {tableColumns.map((_, colIndex) => (
                      <TableCell key={`loading-cell-${colIndex}`} className="px-2 py-2">
                        <div className="h-4 bg-gray-200 animate-pulse rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      "border-b border-gray-100 transition-colors",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                      onRowClick && "cursor-pointer hover:bg-gray-50",
                      row.getIsSelected() && "bg-blue-50"
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-2 py-2 text-sm md:text-xs text-gray-900">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="px-4 py-12 text-center text-gray-500 text-sm"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Controls */}
        {enablePagination && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">Rows per page</p>
              <Select
                value={`${enablePagination ? table.getState().pagination.pageSize : 20}`}
                onValueChange={(value) => {
                  if (enablePagination) {
                    table.setPageSize(Number(value));
                  }
                }}
              >
                <SelectTrigger className="h-8 w-[70px] text-sm">
                  <SelectValue placeholder={enablePagination ? table.getState().pagination.pageSize : 20} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`} className="text-sm">
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                {enablePagination ? (
                  <>
                    Showing {Math.min(currentPage * table.getState().pagination.pageSize + 1, totalCount)}-{Math.min((currentPage + 1) * table.getState().pagination.pageSize, totalCount)} of {totalCount}
                  </>
                ) : (
                  `${table.getFilteredRowModel().rows.length} total`
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                  if (pageNum >= totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      className="h-8 w-8 p-0"
                      onClick={() => table.setPageIndex(pageNum)}
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!canNextPage}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!canNextPage}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-gray-600">
          {enablePagination 
            ? `${totalCount} total`
            : `${table.getFilteredRowModel().rows.length} total`
          }
        </div>
      </div>
    </div>
  );
}

// Helper function to create sortable header
export function createSortableHeader(title: string) {
  return ({ column }: any) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent font-medium text-gray-700 text-xs"
      >
        {title}
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    );
  };
}

// Helper function to create action column with individual buttons
export function createActionColumn<T>(
  onView?: (item: T) => void,
  onEdit?: (item: T) => void,
  onDelete?: (item: T) => void,
  additionalActions?: Array<{
    label: string;
    onClick: (item: T) => void;
    icon?: React.ComponentType<{ className?: string }>;
  }>
) {
  return {
    id: 'actions',
    enableHiding: false,
    header: '',
    cell: ({ row }: any) => {
      const item = row.original;

      return (
        <div className="flex items-center justify-end space-x-0.5">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                onView(item);
              }}
              title="View"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-green-50 hover:text-green-600"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              title="Edit"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {additionalActions?.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(item);
              }}
              title={action.label}
            >
              {action.icon ? <action.icon className="h-3 w-3" /> : action.label}
            </Button>
          ))}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      );
    },
  };
}
