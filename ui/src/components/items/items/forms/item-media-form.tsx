import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { Button } from "@/components/ui/button"
import { Upload, File, Image, Video, Music, FileText, Trash2, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { useItemMediaByItemId, useCreateItemMedia, useUpdateItemMedia, useDeleteItemMedia, ItemMedia } from "@/hooks/items/use-item-media"
import { useToast } from "@/hooks/use-toast"

interface ItemMediaFormProps {
  control: any;
  itemId?: number;
}

export function ItemMediaForm({ control, itemId }: ItemMediaFormProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // API hooks
  const { data: mediaFiles = [], isLoading, refetch } = useItemMediaByItemId(itemId || 0);
  const createMediaMutation = useCreateItemMedia();
  const updateMediaMutation = useUpdateItemMedia();
  const deleteMediaMutation = useDeleteItemMedia();

  const mediaTypeOptions = [
    { label: "Select media type", value: "-1" },
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
    { label: "Document", value: "document" },
    { label: "Audio", value: "audio" },
    { label: "Other", value: "other" },
  ];

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !itemId) return;

    setUploading(true);
    try {
      // Convert file to base64 for API
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const fileExtension = selectedFile.name.split('.').pop() || '';
        
        const mediaData = {
          itemId: itemId,
          fileName: selectedFile.name,
          filePath: base64, // This should be handled by backend file upload
          fileSize: selectedFile.size,
          mediaType: "image", // Default, can be enhanced
          description: "",
          isActive: true,
        };

        await createMediaMutation.mutateAsync({ itemId, data: mediaData });
        
        toast({
          title: "Success",
          description: "Media uploaded successfully",
        });
        
        setSelectedFile(null);
        refetch();
      };
      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to upload media",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!itemId) return;

    try {
      await deleteMediaMutation.mutateAsync({ itemId, id: mediaId });
      toast({
        title: "Success",
        description: "Media deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete media",
        variant: "destructive",
      });
    }
  };

  const handleViewMedia = (media: ItemMedia) => {
    // Open media in new tab or modal
    if (media.filePath) {
      window.open(media.filePath, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Media */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">📁</span>
            </div>
            Upload Media
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={control}
              name="mediaType"
              label="Media Type"
              options={mediaTypeOptions}
            />
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <label className="text-[12px] font-medium">File</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="w-full p-2 border border-gray-300 rounded text-[12px]"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />
              </div>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || uploading || !itemId}
                className="px-4 py-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media List */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Media Files</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2">Loading media files...</p>
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No media files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mediaFiles.map((media) => (
                <div key={media.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getMediaTypeIcon(media.mediaType)}
                      <div>
                        <h4 className="font-medium text-sm">{media.fileName}</h4>
                        <p className="text-xs text-gray-500">
                          {media.fileSize ? `${(media.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMedia(media)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMedia(media.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={deleteMediaMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {media.description && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">{media.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Statistics */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Media Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mediaFiles.length}</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {mediaFiles.reduce((acc, file) => acc + (file.fileSize || 0), 0) / 1024 / 1024 > 1 
                  ? `${(mediaFiles.reduce((acc, file) => acc + (file.fileSize || 0), 0) / 1024 / 1024).toFixed(2)} MB`
                  : `${(mediaFiles.reduce((acc, file) => acc + (file.fileSize || 0), 0) / 1024).toFixed(1)} KB`
                }
              </div>
              <div className="text-sm text-gray-600">Total Size</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {mediaFiles.filter(f => f.mediaType === 'image').length}
              </div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 