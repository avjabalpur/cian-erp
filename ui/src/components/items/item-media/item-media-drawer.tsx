"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCreateItemMedia, useUpdateItemMedia } from "@/hooks/items/use-item-media";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormTextarea } from "@/components/shared/forms/form-textarea";
import { RightDrawer } from "@/components/shared/right-drawer";

const itemMediaSchema = z.object({
  itemId: z.number().min(1, "Item ID is required"),
  fileName: z.string().min(1, "File name is required"),
  filePath: z.string().min(1, "File path is required"),
  fileSize: z.number().optional(),
  mediaType: z.string().min(1, "Media type is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ItemMediaFormData = z.infer<typeof itemMediaSchema>;

interface ItemMediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itemMedia?: any;
  itemId?: number;
  onSuccess: () => void;
}

export default function ItemMediaDrawer({
  isOpen,
  onClose,
  itemMedia,
  itemId,
  onSuccess,
}: ItemMediaDrawerProps) {
  const { toast } = useToast();
  const createItemMediaMutation = useCreateItemMedia();
  const updateItemMediaMutation = useUpdateItemMedia();

  const form = useForm<ItemMediaFormData>({
    resolver: zodResolver(itemMediaSchema),
    defaultValues: {
      itemId: itemId || 0,
      fileName: "",
      filePath: "",
      fileSize: undefined,
      mediaType: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (itemMedia) {
      form.reset({
        itemId: itemMedia.itemId || itemId || 0,
        fileName: itemMedia.fileName || "",
        filePath: itemMedia.filePath || "",
        fileSize: itemMedia.fileSize || undefined,
        mediaType: itemMedia.mediaType || "",
        description: itemMedia.description || "",
        isActive: itemMedia.isActive ?? true,
      });
    } else {
      form.reset({
        itemId: itemId || 0,
        fileName: "",
        filePath: "",
        fileSize: undefined,
        mediaType: "",
        description: "",
        isActive: true,
      });
    }
  }, [itemMedia, itemId, form]);

  const onSubmit = async (data: ItemMediaFormData) => {
    try {
      if (itemMedia) {
        await updateItemMediaMutation.mutateAsync({
          id: itemMedia.id,
          data,
        });
        toast({
          title: "Success",
          description: "Item media updated successfully",
        });
      } else {
        await createItemMediaMutation.mutateAsync(data);
        toast({
          title: "Success",
          description: "Item media created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: itemMedia 
          ? "Failed to update item media" 
          : "Failed to create item media",
        variant: "destructive",
      });
    }
  };

  const isLoading = createItemMediaMutation.isPending || updateItemMediaMutation.isPending;

  const mediaTypeOptions = [
    { label: "Select media type", value: "" },
    { label: "Image", value: "image" },
    { label: "Document", value: "document" },
    { label: "Video", value: "video" },
    { label: "Audio", value: "audio" },
    { label: "PDF", value: "pdf" },
  ];

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={itemMedia ? "Edit Item Media" : "Create New Item Media"}
      description={itemMedia 
        ? "Update the item media information below." 
        : "Fill in the information below to create a new item media."
      }
    >
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            control={form.control}
            name="fileName"
            label="File Name"
            placeholder="Enter file name"
            required
          />

          <FormSelect
            control={form.control}
            name="mediaType"
            label="Media Type"
            options={mediaTypeOptions}
            required
          />

          <FormInput
            control={form.control}
            name="filePath"
            label="File Path"
            placeholder="Enter file path or URL"
            required
          />

          <FormInput
            control={form.control}
            name="fileSize"
            label="File Size (bytes)"
            placeholder="Enter file size in bytes"
            inputProps={{ type: "number" }}
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter media description"
          />

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Active Status</label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this media item
              </p>
            </div>
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : itemMedia ? "Update Media" : "Create Media"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </RightDrawer>
  );
} 