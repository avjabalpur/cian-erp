using Microsoft.AspNetCore.Http;
using System;

namespace Xcianify.Core.Model
{
    public class ItemMedia : BaseModel
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string? MediaType { get; set; }
        public string? FileName { get; set; }
        public string? FileExtension { get; set; }
        public long? FileSizeBytes { get; set; }
        public string? MimeType { get; set; }
        public string? MediaUrl { get; set; }
        public string? Description { get; set; }
        public IFormFile? File { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
