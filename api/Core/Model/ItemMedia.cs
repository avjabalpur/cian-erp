using System;

namespace Xcianify.Core.Model
{
    public class ItemMedia : BaseModel
    {
        public int Id { get; set; }
        public string ItemCode { get; set; }
        public string MediaType { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public int? FileSizeBytes { get; set; }
        public string MimeType { get; set; }
        public string MediaUrl { get; set; }
        public string Description { get; set; }
        public string UploadedBy { get; set; }
        public DateTime? UploadedAt { get; set; }
    }
}
