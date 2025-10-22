"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { useUploadSalesOrderDocument, useDeleteSalesOrderDocument } from "../hooks/use-sales-order-documents";
import { SalesOrderDocument } from "../types/sales-order-extended.types";

interface ReferenceDocumentsProps {
  salesOrderId: number;
  disabled?: boolean;
  documents: SalesOrderDocument[];
  isLoading: boolean;
}

export function ReferenceDocuments({ salesOrderId, disabled, documents, isLoading }: ReferenceDocumentsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadDocumentMutation = useUploadSalesOrderDocument();
  const deleteDocumentMutation = useDeleteSalesOrderDocument();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('salesOrderId', salesOrderId.toString());

      await uploadDocumentMutation.mutateAsync({
        salesOrderId,
        formData,
      });

      toast.success('Document uploaded successfully');
      setSelectedFile(null);
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast.error(error?.message || 'Failed to upload document');
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await deleteDocumentMutation.mutateAsync({
        salesOrderId,
        documentId,
      });
      toast.success('Document deleted successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete document');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      {!disabled && (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              disabled={uploadDocumentMutation.isPending}
            />
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadDocumentMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadDocumentMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No documents uploaded yet</p>
          </div>
        ) : (
          documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{document.documentName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Badge variant="outline">{document.documentType}</Badge>
                    <span>{formatFileSize(document.fileSize)}</span>
                    <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {!disabled && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(document.id)}
                  disabled={deleteDocumentMutation.isPending}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

