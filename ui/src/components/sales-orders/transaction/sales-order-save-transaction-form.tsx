"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SalesOrderSaveTransaction, CreateSalesOrderSaveTransactionData } from "@/types/sales-order-extended"

const saveTransactionSchema = z.object({
  salesOrderId: z.number().min(1, "Sales order ID is required"),
  diff: z.string().optional(),
})

type SaveTransactionFormData = z.infer<typeof saveTransactionSchema>

interface SalesOrderSaveTransactionFormProps {
  saveTransaction?: SalesOrderSaveTransaction
  salesOrderId?: number
  onSubmit: (data: CreateSalesOrderSaveTransactionData) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function SalesOrderSaveTransactionForm({
  saveTransaction,
  salesOrderId,
  onSubmit,
  onCancel,
  isLoading = false,
}: SalesOrderSaveTransactionFormProps) {
  const form = useForm<SaveTransactionFormData>({
    resolver: zodResolver(saveTransactionSchema),
    defaultValues: {
      salesOrderId: salesOrderId || saveTransaction?.salesOrderId || 0,
      diff: saveTransaction?.diff || "",
    },
  })

  const handleSubmit = (data: SaveTransactionFormData) => {
    onSubmit({
      salesOrderId: data.salesOrderId,
      diff: data.diff,
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {saveTransaction ? "Edit Save Transaction" : "Add Save Transaction"}
        </CardTitle>
        <CardDescription>
          {saveTransaction ? "Update the save transaction details" : "Record changes made to the sales order"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="salesOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Order ID *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter sales order ID"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The ID of the sales order this transaction relates to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Changes Made</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the changes made to the sales order..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about what changes were made to the sales order
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
                {isLoading ? "Saving..." : saveTransaction ? "Update" : "Save Transaction"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 