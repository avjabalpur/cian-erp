"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { SalesOrderPerformaInvoice, CreateSalesOrderPerformaInvoiceData } from "@/types/sales-order-extended"

const performaInvoiceSchema = z.object({
  exporterName: z.string().min(1, "Exporter name is required"),
  organizationName: z.string().optional(),
  consigneeName: z.string().min(1, "Consignee name is required"),
  consigneeContactDetails: z.string().optional(),
  consigneeAddress: z.string().optional(),
  performaInvoiceNumber: z.string().min(1, "Performa invoice number is required"),
  performaInvoiceDate: z.date().optional(),
  exportersReferenceNumber: z.string().optional(),
  otherReferences: z.string().optional(),
  otherBuyerName: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  countryOfFinalDestination: z.string().optional(),
  prepration: z.string().optional(),
  portOfDischarge: z.string().optional(),
  placeOfReceiptByPreCarrier: z.string().optional(),
  finalDestination: z.string().optional(),
  termsOfDelivery: z.string().optional(),
  paymentTerms: z.string().optional(),
  shipmentMode: z.string().optional(),
  portOfLoading: z.string().optional(),
  additionalCharges: z.string().optional(),
  totalAmount: z.number().optional(),
  previousPerformaInvoiceId: z.number().optional(),
})

type PerformaInvoiceFormData = z.infer<typeof performaInvoiceSchema>

interface SalesOrderPerformaInvoiceFormProps {
  performaInvoice?: SalesOrderPerformaInvoice
  onSubmit: (data: CreateSalesOrderPerformaInvoiceData) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function SalesOrderPerformaInvoiceForm({
  performaInvoice,
  onSubmit,
  onCancel,
  isLoading = false,
}: SalesOrderPerformaInvoiceFormProps) {
  const form = useForm<PerformaInvoiceFormData>({
    resolver: zodResolver(performaInvoiceSchema),
    defaultValues: {
      exporterName: performaInvoice?.exporterName || "",
      organizationName: performaInvoice?.organizationName || "",
      consigneeName: performaInvoice?.consigneeName || "",
      consigneeContactDetails: performaInvoice?.consigneeContactDetails || "",
      consigneeAddress: performaInvoice?.consigneeAddress || "",
      performaInvoiceNumber: performaInvoice?.performaInvoiceNumber || "",
      performaInvoiceDate: performaInvoice?.performaInvoiceDate ? new Date(performaInvoice.performaInvoiceDate) : undefined,
      exportersReferenceNumber: performaInvoice?.exportersReferenceNumber || "",
      otherReferences: performaInvoice?.otherReferences || "",
      otherBuyerName: performaInvoice?.otherBuyerName || "",
      countryOfOrigin: performaInvoice?.countryOfOrigin || "",
      countryOfFinalDestination: performaInvoice?.countryOfFinalDestination || "",
      prepration: performaInvoice?.prepration || "",
      portOfDischarge: performaInvoice?.portOfDischarge || "",
      placeOfReceiptByPreCarrier: performaInvoice?.placeOfReceiptByPreCarrier || "",
      finalDestination: performaInvoice?.finalDestination || "",
      termsOfDelivery: performaInvoice?.termsOfDelivery || "",
      paymentTerms: performaInvoice?.paymentTerms || "",
      shipmentMode: performaInvoice?.shipmentMode || "",
      portOfLoading: performaInvoice?.portOfLoading || "",
      additionalCharges: performaInvoice?.additionalCharges || "",
      totalAmount: performaInvoice?.totalAmount || undefined,
      previousPerformaInvoiceId: performaInvoice?.previousPerformaInvoiceId || undefined,
    },
  })

  const handleSubmit = (data: PerformaInvoiceFormData) => {
    onSubmit({
      ...data,
      performaInvoiceDate: data.performaInvoiceDate?.toISOString().split('T')[0],
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {performaInvoice ? "Edit Performa Invoice" : "Create Performa Invoice"}
        </CardTitle>
        <CardDescription>
          {performaInvoice ? "Update the performa invoice details" : "Create a new performa invoice"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exporter Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Exporter Information</h3>
                
                <FormField
                  control={form.control}
                  name="exporterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exporter Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter exporter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exportersReferenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exporter's Reference Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter reference number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Consignee Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Consignee Information</h3>
                
                <FormField
                  control={form.control}
                  name="consigneeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consignee Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter consignee name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consigneeContactDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Details</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact details" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consigneeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Invoice Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Invoice Details</h3>
                
                <FormField
                  control={form.control}
                  name="performaInvoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performa Invoice Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter invoice number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="performaInvoiceDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Invoice Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                          step="0.01"
                          placeholder="Enter total amount"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Shipping Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Shipping Details</h3>
                
                <FormField
                  control={form.control}
                  name="countryOfOrigin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Origin</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country of origin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="countryOfFinalDestination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Final Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter final destination country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="portOfLoading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port of Loading</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter port of loading" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="portOfDischarge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port of Discharge</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter port of discharge" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                
                <FormField
                  control={form.control}
                  name="termsOfDelivery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms of Delivery</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter terms of delivery" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter payment terms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipmentMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipment Mode</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter shipment mode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Other Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Other Details</h3>
                
                <FormField
                  control={form.control}
                  name="otherReferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other References</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter other references" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherBuyerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Buyer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter other buyer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalCharges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Charges</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter additional charges" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : performaInvoice ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 