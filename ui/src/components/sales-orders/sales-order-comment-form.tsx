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
import type { SalesOrderComment, CreateSalesOrderCommentData } from "@/types/sales-order-extended"

const commentSchema = z.object({
  salesOrderId: z.number().min(1, "Sales order ID is required"),
  comments: z.string().min(1, "Comment cannot be empty"),
  status: z.string().optional(),
  type: z.string().optional(),
})

type CommentFormData = z.infer<typeof commentSchema>

interface SalesOrderCommentFormProps {
  comment?: SalesOrderComment
  salesOrderId?: number
  onSubmit: (data: CreateSalesOrderCommentData) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function SalesOrderCommentForm({
  comment,
  salesOrderId,
  onSubmit,
  onCancel,
  isLoading = false,
}: SalesOrderCommentFormProps) {
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      salesOrderId: salesOrderId || comment?.salesOrderId || 0,
      comments: comment?.comments || "",
      status: comment?.status || "",
      type: comment?.type || "",
    },
  })

  const handleSubmit = (data: CommentFormData) => {
    onSubmit({
      salesOrderId: data.salesOrderId,
      comments: data.comments,
      status: data.status,
      type: data.type,
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {comment ? "Edit Comment" : "Add Comment"}
        </CardTitle>
        <CardDescription>
          {comment ? "Update the comment details" : "Add a new comment to the sales order"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your comment..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed information about the sales order
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select comment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Issue">Issue</SelectItem>
                        <SelectItem value="Update">Update</SelectItem>
                        <SelectItem value="Approval">Approval</SelectItem>
                        <SelectItem value="Rejection">Rejection</SelectItem>
                        <SelectItem value="Note">Note</SelectItem>
                        <SelectItem value="Reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Categorize the comment for better organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the current status of this comment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : comment ? "Update" : "Add Comment"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 