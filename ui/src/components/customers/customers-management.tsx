"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCustomers, type Customer, type CustomerFilters } from "@/hooks/use-customers"
import CustomerFilter from "./customer-filter"
import CustomerTable from "./customer-table"
import CustomerForm from "./customer-form"
import { useRouter } from "next/navigation"

export default function CustomersManagement() {
  const { toast } = useToast()
  const router = useRouter()
  const { customers, loading, createCustomer, updateCustomer, deleteCustomer, toggleCustomerStatus } = useCustomers()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const [filters, setFilters] = useState<CustomerFilters>({
    search: "",
    customerType: "",
    status: "",
    city: "",
  })

  // Filter customers based on current filters
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        !filters.search ||
        customer.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.customerNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.shortName.toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.search.toLowerCase())

      const matchesType = !filters.customerType || customer.customerType === filters.customerType

      const matchesStatus =
        !filters.status ||
        (filters.status === "active" && customer.isActive) ||
        (filters.status === "inactive" && !customer.isActive)

      const matchesCity = !filters.city || customer.city === filters.city

      return matchesSearch && matchesType && matchesStatus && matchesCity
    })
  }, [customers, filters])

  const handleCreateCustomer = async (data: any) => {
    try {
      setFormLoading(true)
      await createCustomer(data)
      setIsAddDialogOpen(false)
      toast({
        title: "Success",
        description: "Customer created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateCustomer = async (data: any) => {
    if (!selectedCustomer) return

    try {
      setFormLoading(true)
      await updateCustomer(selectedCustomer.id, data)
      setIsEditDialogOpen(false)
      setSelectedCustomer(null)
      toast({
        title: "Success",
        description: "Customer updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return

    try {
      await deleteCustomer(id)
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleCustomerStatus(id)
      toast({
        title: "Success",
        description: "Customer status updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer status",
        variant: "destructive",
      })
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    router.push(`/admin/customers/${customer.id}/edit`)
  }

  const handleViewCustomer = (customer: Customer) => {
    // TODO: Implement view customer details
    console.log("View customer:", customer)
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      customerType: "",
      status: "",
      city: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="mt-2 text-gray-600">Manage customers, hospitals, pharmacies and distributors</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find customers using various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerFilter filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>A list of all customers with their details and status</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerTable
            customers={filteredCustomers}
            loading={loading}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onToggleStatus={handleToggleStatus}
            onView={handleViewCustomer}
          />
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Create a new customer record with complete details.</DialogDescription>
          </DialogHeader>
          <CustomerForm
            onSubmit={handleCreateCustomer}
            onCancel={() => setIsAddDialogOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information and details.</DialogDescription>
          </DialogHeader>
          <CustomerForm
            customer={selectedCustomer}
            onSubmit={handleUpdateCustomer}
            onCancel={() => {
              setIsEditDialogOpen(false)
              setSelectedCustomer(null)
            }}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
