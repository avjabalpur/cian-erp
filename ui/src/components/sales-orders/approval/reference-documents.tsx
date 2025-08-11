"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download, X, FileImage, FileText as FilePdf } from "lucide-react";
import { SalesOrderDocument } from "@/types/sales-order-extended";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUploadSalesOrderDocument } from "@/hooks/sales-order/use-sales-order-documents";
import { useQueryClient } from "@tanstack/react-query";

interface ReferenceDocumentsProps {
  salesOrderId: number;
  disabled?: boolean;
  documents?: SalesOrderDocument[];
  isLoading?: boolean;
}

export function ReferenceDocuments({
  salesOrderId,
  disabled,
  documents = [],
  isLoading = false,
}: ReferenceDocumentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tag, setTag] = useState<string>("screenshot");
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocumentMutation = useUploadSalesOrderDocument();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select an image or PDF file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (1.5MB for PDF, 700KB for images)
      const maxSize = file.type === "application/pdf" ? 1.5 * 1024 * 1024 : 0.7 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `File size should be less than ${file.type === "application/pdf" ? "1.5MB" : "700KB"}`,
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadDocumentMutation.mutateAsync({
        salesOrderId,
        file: selectedFile,
        tag
      });
      
      toast({
        title: "File uploaded successfully",
        description: "The document has been added to the sales order",
      });
      
      // Reset form and close modal
      setSelectedFile(null);
      setTag("screenshot");
      setIsUploadOpen(false);
      
      // Refresh documents list
      queryClient.invalidateQueries({ queryKey: ["sales-order-documents", salesOrderId] });
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (doc: SalesOrderDocument) => {
    // Download the file using the download endpoint
    const downloadUrl = `/api/sales-order/${salesOrderId}/documents/${doc.id}/download`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "File download has started",
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex gap-2">
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* File Selection */}
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {selectedFile.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      disabled={isUploading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Tag Selection */}
              <div className="space-y-2">
                <Label htmlFor="tag">Document Tag</Label>
                <Select value={tag} onValueChange={setTag} disabled={isUploading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screenshot">Screenshot</SelectItem>
                    <SelectItem value="artwork">Artwork</SelectItem>
                    <SelectItem value="quotation">Quotation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Upload Button */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUploadOpen(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Documents List - Always Displayed */}
      {isLoading ? (
        <div className="text-center py-4">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No documents attached yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((document) => (
            <Card key={document.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {document.fileType === "application/pdf" ? (
                      <FilePdf className="h-4 w-4 text-red-500" />
                    ) : (
                      <FileImage className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="font-medium text-sm">{document.fileName}</span>
                  </div>
                  {document.tag && (
                    <Badge variant="secondary" className="text-xs">
                      {document.tag}
                    </Badge>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    <div>Type: {document.fileType || "Unknown"}</div>
                    <div>Uploaded: {new Date(document.createdAt).toLocaleDateString()}</div>
                    {document.createdByName && (
                      <div>By: {document.createdByName}</div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(document)}
                  disabled={disabled}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 