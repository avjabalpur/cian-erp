"use client";

import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface ReferenceDocumentsProps {
  onUploadFile: () => void;
  onViewAttachedDocuments: () => void;
  attachedDocumentsCount?: number;
  disabled?: boolean;
}

export function ReferenceDocuments({ 
  onUploadFile, 
  onViewAttachedDocuments, 
  attachedDocumentsCount = 0,
  disabled 
}: ReferenceDocumentsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onUploadFile}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
        <Button
          variant="ghost"
          onClick={onViewAttachedDocuments}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Attached Documents
          {attachedDocumentsCount > 0 && (
            <span className="ml-2 px-2 py-1 text-xs bg-muted rounded-full">
              {attachedDocumentsCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
} 