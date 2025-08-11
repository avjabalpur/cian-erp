"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Eye, Download } from "lucide-react";
import { SalesOrderDocument } from "@/types/sales-order-extended";

interface ReferenceDocumentsProps {
  onUploadFile: () => void;
  onViewAttachedDocuments: () => void;
  disabled?: boolean;
  documents?: SalesOrderDocument[];
  isLoading?: boolean;
}

export function ReferenceDocuments({
  onUploadFile,
  onViewAttachedDocuments,
  disabled,
  documents = [],
  isLoading = false,
}: ReferenceDocumentsProps) {
  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUploadFile}
          disabled={disabled}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewAttachedDocuments}
          disabled={disabled}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Attached Documents
        </Button>
      </div>

      {/* Documents List */}
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
                    <FileText className="h-4 w-4 text-muted-foreground" />
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
                  onClick={() => {
                    // Handle document download/view
                    console.log("View document:", document.id);
                  }}
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