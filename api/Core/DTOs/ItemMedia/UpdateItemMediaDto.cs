using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ItemMedia
{
    public class UpdateItemMediaDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string ItemId { get; set; }
        [Required]
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
