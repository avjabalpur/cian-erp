"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Edit, Trash2, Search, Plus, Upload } from "lucide-react";
import { useDocumentsBySalesOrder, useDeleteSalesOrderDocument, useCreateSalesOrderDocument } from "@/hooks/sales-order/use-sales-order-documents";
import type { SalesOrderDocument, CreateSalesOrderDocumentData } from "@/types/sales-order-extended";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SalesOrderDocumentsProps {
  salesOrderId: number;
}

export function SalesOrderDocuments({ salesOrderId }: SalesOrderDocumentsProps) {
  const [search, setsearch] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    fileName: "",
    filePath: "",
    fileType: "",
    tag: "",
    metadata: ""
  });
  
  const { data: documents = [], isLoading, refetch } = useDocumentsBySalesOrder(salesOrderId);
  const deleteDocumentMutation = useDeleteSalesOrderDocument();
  const createDocumentMutation = useCreateSalesOrderDocument();

  const filteredDocuments = documents.filter((doc: SalesOrderDocument) =>
    doc.fileName.toLowerCase().includes(search.toLowerCase()) ||
    doc.tag?.toLowerCase().includes(search.toLowerCase()) ||
    doc.fileType?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteDocument = async (documentId: number) => {
    try {
      await deleteDocumentMutation.mutateAsync({ salesOrderId, documentId });
      refetch();
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadData.fileName.trim() || !uploadData.filePath.trim()) return;

    const documentData: CreateSalesOrderDocumentData = {
      salesOrderId,
      fileName: uploadData.fileName.trim(),
      filePath: uploadData.filePath.trim(),
      fileType: uploadData.fileType.trim() || undefined,
      tag: uploadData.tag.trim() || undefined,
      metadata: uploadData.metadata.trim() || undefined,
    };

    try {
      await createDocumentMutation.mutateAsync({ salesOrderId, data: documentData });
      setUploadData({ fileName: "", filePath: "", fileType: "", tag: "", metadata: "" });
      setShowUploadForm(false);
      refetch();
    } catch (error) {
      console.error("Failed to upload document:", error);
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="h-4 w-4" />;
    
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) return <FileText className="h-4 w-4 text-red-500" />;
    if (type.includes("image")) return <FileText className="h-4 w-4 text-green-500" />;
    if (type.includes("word") || type.includes("doc")) return <FileText className="h-4 w-4 text-blue-500" />;
    if (type.includes("excel") || type.includes("sheet")) return <FileText className="h-4 w-4 text-green-600" />;
    return <FileText className="h-4 w-4" />;
  };

  const getFileTypeBadge = (fileType?: string) => {
    if (!fileType) return <Badge variant="outline">Unknown</Badge>;
    
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) return <Badge variant="destructive">PDF</Badge>;
    if (type.includes("image")) return <Badge variant="default">Image</Badge>;
    if (type.includes("word") || type.includes("doc")) return <Badge variant="secondary">Document</Badge>;
    if (type.includes("excel") || type.includes("sheet")) return <Badge variant="outline">Spreadsheet</Badge>;
    return <Badge variant="outline">{fileType.toUpperCase()}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowUploadForm(!showUploadForm)}
            variant={showUploadForm ? "outline" : "default"}
          >
            {showUploadForm ? (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload Form */}
          {showUploadForm && (
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Upload New Document</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fileName">File Name *</Label>
                  <Input
                    id="fileName"
                    placeholder="Enter file name"
                    value={uploadData.fileName}
                    onChange={(e) => setUploadData({ ...uploadData, fileName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="filePath">File Path *</Label>
                  <Input
                    id="filePath"
                    placeholder="Enter file path or URL"
                    value={uploadData.filePath}
                    onChange={(e) => setUploadData({ ...uploadData, filePath: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fileType">File Type</Label>
                  <Input
                    id="fileType"
                    placeholder="e.g., PDF, DOC, PNG"
                    value={uploadData.fileType}
                    onChange={(e) => setUploadData({ ...uploadData, fileType: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="tag">Tag</Label>
                  <Input
                    id="tag"
                    placeholder="e.g., Contract, Invoice"
                    value={uploadData.tag}
                    onChange={(e) => setUploadData({ ...uploadData, tag: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="metadata">Description</Label>
                <Textarea
                  id="metadata"
                  placeholder="Enter document description"
                  value={uploadData.metadata}
                  onChange={(e) => setUploadData({ ...uploadData, metadata: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleUploadDocument}
                  disabled={!uploadData.fileName.trim() || !uploadData.filePath.trim() || createDocumentMutation.isPending}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUploadForm(false);
                    setUploadData({ fileName: "", filePath: "", fileType: "", tag: "", metadata: "" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setsearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Documents List */}
          <ScrollArea className="border rounded-md p-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {search ? "No documents found matching your search." : "No documents uploaded yet."}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((document: SalesOrderDocument) => (
                  <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      {getFileIcon(document.fileType)}
                      <div>
                        <h4 className="font-medium text-sm">{document.fileName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {getFileTypeBadge(document.fileType)}
                          {document.tag && (
                            <Badge variant="outline" className="text-xs">
                              {document.tag}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(document.createdAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(document.filePath, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteDocument(document.id)}
                        disabled={deleteDocumentMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
} 