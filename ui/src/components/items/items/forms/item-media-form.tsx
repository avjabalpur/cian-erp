import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormTextArea } from "@/components/shared/forms/form-text-area"
import { Button } from "@/components/ui/button"
import { Upload, File, Image, Video, Music, FileText, Trash2 } from "lucide-react"
import { useState } from "react"

interface ItemMediaFormProps {
  control: any;
  itemId?: number;
}

interface MediaFile {
  id?: number;
  mediaType: string;
  fileName: string;
  fileExtension: string;
  fileSizeBytes: number;
  mimeType: string;
  mediaUrl: string;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
}

export function ItemMediaForm({ control, itemId }: ItemMediaFormProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleUpload = () => {
    if (selectedFile) {
      const newMedia: MediaFile = {
        mediaType: "image", // Default, can be changed
        fileName: selectedFile.name,
        fileExtension: selectedFile.name.split('.').pop() || '',
        fileSizeBytes: selectedFile.size,
        mimeType: selectedFile.type,
        mediaUrl: URL.createObjectURL(selectedFile),
        description: "",
        uploadedBy: "Current User", // This should come from auth context
        uploadedAt: new Date().toISOString(),
      };
      setMediaFiles([...mediaFiles, newMedia]);
      setSelectedFile(null);
    }
  };

  const handleDeleteMedia = (index: number) => {
    const updatedMedia = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedMedia);
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
                disabled={!selectedFile}
                className="px-4 py-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
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
          {mediaFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No media files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mediaFiles.map((media, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getMediaTypeIcon(media.mediaType)}
                      <div>
                        <h4 className="font-medium text-sm">{media.fileName}</h4>
                        <p className="text-xs text-gray-500">
                          {media.fileExtension.toUpperCase()} • {(media.fileSizeBytes / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMedia(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <FormInput
                      control={control}
                      name={`mediaFiles.${index}.description`}
                      label="Description"
                      placeholder="Enter media description"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <FormInput
                        control={control}
                        name={`mediaFiles.${index}.uploadedBy`}
                        label="Uploaded By"
                        placeholder="Enter uploader name"
                      />
                      <FormInput
                        control={control}
                        name={`mediaFiles.${index}.uploadedAt`}
                        label="Upload Date"
                        placeholder=""
                        inputProps={{ type: "datetime-local" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 