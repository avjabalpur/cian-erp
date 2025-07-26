"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCustomers, type Customer } from "@/hooks/use-customers"
import CustomerForm from "./customer-form"

interface CustomerEditPageProps {
  customerId: number
}

export default function CustomerEditPage({ customerId }: CustomerEditPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { customers, updateCustomer, loading } = useCustomers()
  const [customer, setCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    const foundCustomer = customers.find((c) => c.id === customerId)
    if (foundCustomer) {
      setCustomer(foundCustomer)
    } else if (!loading) {
      toast({
        title: "Error",
        description: "Customer not found",
        variant: "destructive",
      })
      router.push("/admin/customers")
    }
  }, [customers, customerId, loading, router, toast])

  const handleSubmit = async (data: any) => {
    try {
      await updateCustomer(customerId, data)
      toast({
        title: "Success",
        description: "Customer updated successfully",
      })
      router.push("/admin/customers")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    router.push("/admin/customers")
  }

  if (loading || !customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
          <p className="mt-2 text-gray-600">Update customer information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Update the customer details below</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm customer={customer} onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}
