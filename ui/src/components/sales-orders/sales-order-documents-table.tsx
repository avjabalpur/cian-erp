"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Edit, Trash2, Search, Plus, Paperclip } from "lucide-react";
import { useDocumentsBySalesOrder, useDeleteSalesOrderDocument } from "@/hooks/sales-order/use-sales-order-documents";
import type { SalesOrderDocument } from "@/types/sales-order-extended";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SalesOrderDocumentsProps {
  salesOrderId: number;
}

export function SalesOrderDocuments({ salesOrderId }: SalesOrderDocumentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: documents = [], isLoading, refetch } = useDocumentsBySalesOrder(salesOrderId);
  const deleteDocumentMutation = useDeleteSalesOrderDocument();

  const filteredDocuments = documents.filter((doc: SalesOrderDocument) =>
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.fileType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteDocument = async (documentId: number) => {
    try {
      await deleteDocumentMutation.mutateAsync({ salesOrderId, documentId });
      refetch();
    } catch (error) {
      console.error("Failed to delete document:", error);
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
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center gap-2">
       <div className="flex justify-between items-center gap-2">
       <Paperclip className="h-5 w-5" />
       Documents
       </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
    <div className="space-y-4">

      {/* Documents List */}
      <ScrollArea className="border rounded-md p-4">
        {filteredDocuments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {searchTerm ? "No documents found matching your search." : "No documents uploaded yet."}
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
                  >
                    <Edit className="h-4 w-4" />
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