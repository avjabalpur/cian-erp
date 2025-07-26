"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreHorizontal, Phone, MapPin, Eye, UserCheck, UserX } from "lucide-react"
import type { Customer } from "@/hooks/use-customers"

interface CustomerTableProps {
  customers: Customer[]
  loading: boolean
  onEdit: (customer: Customer) => void
  onDelete: (id: number) => void
  onToggleStatus: (id: number) => void
  onView: (customer: Customer) => void
}

export default function CustomerTable({
  customers,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
}: CustomerTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No customers found</div>
        <div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Credit Info</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{customer.customerName}</p>
                  <p className="text-sm text-gray-500">{customer.customerNumber}</p>
                  <p className="text-sm text-gray-500">{customer.shortName}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{customer.customerType}</Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Phone className="w-3 h-3 mr-1" />
                    {customer.phone}
                  </div>
                  <div className="text-sm text-gray-500">{customer.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  {customer.city}, {customer.state}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>₹{customer.creditLimit.toLocaleString()}</p>
                  <p className="text-gray-500">{customer.creditDays} days</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{customer.totalOrders}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={customer.isActive ? "default" : "destructive"} className="flex items-center w-fit">
                  {customer.isActive ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                  {customer.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(customer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(customer)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(customer.id)}>
                      {customer.isActive ? (
                        <>
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(customer.id)} className="text-red-600">
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
