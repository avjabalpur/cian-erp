"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import type { Customer, CreateCustomerData } from "@/hooks/use-customers"

interface CustomerFormProps {
  customer?: Customer | null
  onSubmit: (data: CreateCustomerData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function CustomerForm({ customer, onSubmit, onCancel, loading = false }: CustomerFormProps) {
  const [formData, setFormData] = useState<CreateCustomerData>({
    customerNumber: "",
    customerName: "",
    shortName: "",
    customerType: "",
    gstin: "",
    panNumber: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    creditLimit: 0,
    creditDays: 0,
  })

  const [errors, setErrors] = useState<Partial<CreateCustomerData>>({})

  useEffect(() => {
    if (customer) {
      setFormData({
        customerNumber: customer.customerNumber,
        customerName: customer.customerName,
        shortName: customer.shortName,
        customerType: customer.customerType,
        gstin: customer.gstin,
        panNumber: customer.panNumber,
        phone: customer.phone,
        email: customer.email,
        address: customer.address || "",
        city: customer.city,
        state: customer.state,
        creditLimit: customer.creditLimit,
        creditDays: customer.creditDays,
      })
    }
  }, [customer])

  const handleChange = (field: keyof CreateCustomerData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateCustomerData> = {}

    if (!formData.customerNumber.trim()) {
      newErrors.customerNumber = "Customer number is required"
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required"
    }
    if (!formData.customerType) {
      newErrors.customerType = "Customer type is required"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>

          <div className="space-y-2">
            <Label htmlFor="customerNumber">Customer Number *</Label>
            <Input
              id="customerNumber"
              value={formData.customerNumber}
              onChange={(e) => handleChange("customerNumber", e.target.value)}
              placeholder="CUST001"
              disabled={!!customer} // Disable editing for existing customers
            />
            {errors.customerNumber && (
              <Alert variant="destructive">
                <AlertDescription>{errors.customerNumber}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              placeholder="City General Hospital"
            />
            {errors.customerName && (
              <Alert variant="destructive">
                <AlertDescription>{errors.customerName}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortName">Short Name</Label>
            <Input
              id="shortName"
              value={formData.shortName}
              onChange={(e) => handleChange("shortName", e.target.value)}
              placeholder="City Hospital"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerType">Customer Type *</Label>
            <Select value={formData.customerType} onValueChange={(value) => handleChange("customerType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hospital">Hospital</SelectItem>
                <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                <SelectItem value="Distributor">Distributor</SelectItem>
                <SelectItem value="Clinic">Clinic</SelectItem>
                <SelectItem value="Retailer">Retailer</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
              </SelectContent>
            </Select>
            {errors.customerType && (
              <Alert variant="destructive">
                <AlertDescription>{errors.customerType}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Contact & Legal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact & Legal Information</h3>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91-9876543210"
            />
            {errors.phone && (
              <Alert variant="destructive">
                <AlertDescription>{errors.phone}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="contact@customer.com"
            />
            {errors.email && (
              <Alert variant="destructive">
                <AlertDescription>{errors.email}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN</Label>
            <Input
              id="gstin"
              value={formData.gstin}
              onChange={(e) => handleChange("gstin", e.target.value)}
              placeholder="27AABCU9603R1ZX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="panNumber">PAN Number</Label>
            <Input
              id="panNumber"
              value={formData.panNumber}
              onChange={(e) => handleChange("panNumber", e.target.value)}
              placeholder="AABCU9603R"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address Information</h3>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Enter complete address..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Mumbai"
            />
            {errors.city && (
              <Alert variant="destructive">
                <AlertDescription>{errors.city}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="Maharashtra"
            />
            {errors.state && (
              <Alert variant="destructive">
                <AlertDescription>{errors.state}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Credit Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Credit Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
            <Input
              id="creditLimit"
              type="number"
              value={formData.creditLimit}
              onChange={(e) => handleChange("creditLimit", Number(e.target.value))}
              placeholder="500000"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditDays">Credit Days</Label>
            <Input
              id="creditDays"
              type="number"
              value={formData.creditDays}
              onChange={(e) => handleChange("creditDays", Number(e.target.value))}
              placeholder="30"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {customer ? "Update Customer" : "Create Customer"}
        </Button>
      </div>
    </form>
  )
}
