"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SalesOrderQuotation, CreateSalesOrderQuotationData } from "@/types/sales-order-extended"

const quotationSchema = z.object({
  organizationId: z.number().optional(),
  quotationNumber: z.string().min(1, "Quotation number is required"),
  quotationDate: z.string().optional(),
  customerId: z.number().min(1, "Customer is required"),
  advancePercentage: z.number().min(0).max(100).optional(),
  charges: z.string().optional(),
  totalAmount: z.number().min(0).optional(),
  advanceAmount: z.number().min(0).optional(),
  prevCopyQuotationId: z.number().optional(),
})

type QuotationFormData = z.infer<typeof quotationSchema>

interface SalesOrderQuotationFormProps {
  quotation?: SalesOrderQuotation
  onSubmit: (data: CreateSalesOrderQuotationData) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function SalesOrderQuotationForm({
  quotation,
  onSubmit,
  onCancel,
  isLoading = false,
}: SalesOrderQuotationFormProps) {
  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      organizationId: quotation?.organizationId || undefined,
      quotationNumber: quotation?.quotationNumber || "",
      quotationDate: quotation?.quotationDate ? quotation.quotationDate.split('T')[0] : "",
      customerId: quotation?.customerId || 0,
      advancePercentage: quotation?.advancePercentage || undefined,
      charges: quotation?.charges || "",
      totalAmount: quotation?.totalAmount || undefined,
      advanceAmount: quotation?.advanceAmount || undefined,
      prevCopyQuotationId: quotation?.prevCopyQuotationId || undefined,
    },
  })

  const handleSubmit = (data: QuotationFormData) => {
    onSubmit({
      organizationId: data.organizationId,
      quotationNumber: data.quotationNumber,
      quotationDate: data.quotationDate || undefined,
      customerId: data.customerId,
      advancePercentage: data.advancePercentage,
      charges: data.charges,
      totalAmount: data.totalAmount,
      advanceAmount: data.advanceAmount,
      prevCopyQuotationId: data.prevCopyQuotationId,
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {quotation ? "Edit Quotation" : "Add Quotation"}
        </CardTitle>
        <CardDescription>
          {quotation ? "Update the quotation details" : "Create a new quotation"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quotationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quotation Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quotation number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the quotation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quotationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quotation Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Date when the quotation was created
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Customer 1</SelectItem>
                        <SelectItem value="2">Customer 2</SelectItem>
                        <SelectItem value="3">Customer 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the customer for this quotation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Organization 1</SelectItem>
                        <SelectItem value="2">Organization 2</SelectItem>
                        <SelectItem value="3">Organization 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the organization (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="advancePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advance Percentage (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0-100"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Percentage of advance payment required
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Total amount for the quotation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="charges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charges</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter additional charges" {...field} />
                  </FormControl>
                  <FormDescription>
                    Any additional charges or fees
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : quotation ? "Update" : "Create Quotation"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 