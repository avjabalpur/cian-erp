"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreHorizontal, Eye, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import type { Item } from "@/hooks/use-items"

interface ItemTableProps {
  items: Item[]
  loading: boolean
  onView: (item: Item) => void
  onEdit: (item: Item) => void
  onDelete: (id: number) => void
}

export default function ItemTable({ items, loading, onView, onEdit, onDelete }: ItemTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No items found</div>
        <div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</div>
      </div>
    )
  }

  const getStockStatusBadge = (available: number, reorder: number, maxStock: number) => {
    if (available <= reorder * 0.3) {
      return (
        <Badge variant="destructive" className="flex items-center">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Critical
        </Badge>
      )
    } else if (available <= reorder) {
      return (
        <Badge variant="outline" className="flex items-center">
          <TrendingDown className="w-3 h-3 mr-1" />
          Low Stock
        </Badge>
      )
    } else {
      return (
        <Badge variant="default" className="flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          Available
        </Badge>
      )
    }
  }

  const getStockPercentage = (available: number, maxStock: number) => {
    return Math.min((available / maxStock) * 100, 100)
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Code</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>UOM</TableHead>
            <TableHead>Rate (₹)</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Properties</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onView(item)}>
              <TableCell className="font-medium">{item.itemCode}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{item.itemName}</p>
                  <p className="text-sm text-gray-500">{item.shortName}</p>
                </div>
              </TableCell>
              <TableCell>{item.itemType}</TableCell>
              <TableCell>{item.unitOfMeasure}</TableCell>
              <TableCell>₹{item.stdRate.toFixed(2)}</TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.currentStock}</span>
                    <span className="text-gray-500">/ {item.maxStock}</span>
                  </div>
                  <Progress value={getStockPercentage(item.currentStock, item.maxStock)} className="h-2" />
                  {getStockStatusBadge(item.currentStock, item.reorderLevel, item.maxStock)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.manufactured && <Badge variant="outline">Mfg</Badge>}
                  {item.sold && <Badge variant="outline">Sold</Badge>}
                  {item.qcRequired && <Badge variant="outline">QC</Badge>}
                  {item.batchApplicable && <Badge variant="outline">Batch</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={item.isActive ? "default" : "destructive"}>
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(item)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
