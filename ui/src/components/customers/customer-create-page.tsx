"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCustomers } from "@/hooks/use-customers"
import CustomerForm from "./customer-form"

export default function CustomerCreatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { createCustomer } = useCustomers()

  const handleSubmit = async (data: any) => {
    try {
      await createCustomer(data)
      toast({
        title: "Success",
        description: "Customer created successfully",
      })
      router.push("/admin/customers")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    router.push("/admin/customers")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Customer</h1>
          <p className="mt-2 text-gray-600">Add a new customer to the system</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Enter all the required details for the new customer</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}
