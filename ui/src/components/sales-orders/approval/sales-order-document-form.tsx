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
import { Upload, FileText } from "lucide-react"
import type { SalesOrderDocument, CreateSalesOrderDocumentData } from "@/types/sales-order-extended"

const documentSchema = z.object({
  salesOrderId: z.number().min(1, "Sales order ID is required"),
  tag: z.string().optional(),
  fileName: z.string().min(1, "File name is required"),
  filePath: z.string().min(1, "File path is required"),
  fileType: z.string().optional(),
  metadata: z.string().optional(),
})

type DocumentFormData = z.infer<typeof documentSchema>

interface SalesOrderDocumentFormProps {
  document?: SalesOrderDocument
  salesOrderId?: number
  onSubmit: (data: CreateSalesOrderDocumentData) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function SalesOrderDocumentForm({
  document,
  salesOrderId,
  onSubmit,
  onCancel,
  isLoading = false,
}: SalesOrderDocumentFormProps) {
  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      salesOrderId: salesOrderId || document?.salesOrderId || 0,
      tag: document?.tag || "",
      fileName: document?.fileName || "",
      filePath: document?.filePath || "",
      fileType: document?.fileType || "",
      metadata: document?.metadata || "",
    },
  })

  const handleSubmit = (data: DocumentFormData) => {
    onSubmit({
      salesOrderId: data.salesOrderId,
      tag: data.tag,
      fileName: data.fileName,
      filePath: data.filePath,
      fileType: data.fileType,
      metadata: data.metadata,
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue("fileName", file.name)
      form.setValue("fileType", file.type)
      form.setValue("filePath", `/uploads/${file.name}`) // This would be handled by your file upload service
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {document ? "Edit Document" : "Add Document"}
        </CardTitle>
        <CardDescription>
          {document ? "Update the document details" : "Upload a new document for the sales order"}
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
                    The ID of the sales order this document belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter document tag" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional tag to categorize the document
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select file type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="application/pdf">PDF</SelectItem>
                        <SelectItem value="application/msword">Word Document</SelectItem>
                        <SelectItem value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word Document (DOCX)</SelectItem>
                        <SelectItem value="application/vnd.ms-excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Excel Spreadsheet (XLSX)</SelectItem>
                        <SelectItem value="application/vnd.ms-powerpoint">PowerPoint Presentation</SelectItem>
                        <SelectItem value="application/vnd.openxmlformats-officedocument.presentationml.presentation">PowerPoint Presentation (PPTX)</SelectItem>
                        <SelectItem value="image/jpeg">JPEG Image</SelectItem>
                        <SelectItem value="image/png">PNG Image</SelectItem>
                        <SelectItem value="text/plain">Text File</SelectItem>
                        <SelectItem value="application/zip">ZIP Archive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type/category of the file
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter file name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the uploaded file
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="filePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Path *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter file path" {...field} />
                  </FormControl>
                  <FormDescription>
                    The path where the file is stored
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metadata</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter additional metadata or description..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional information about the document
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload Section */}
            {!document && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload a file
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PDF, Word, Excel, PowerPoint, or image files
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt,.zip"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : document ? "Update" : "Upload Document"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 