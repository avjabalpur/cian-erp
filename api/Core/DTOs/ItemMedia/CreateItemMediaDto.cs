using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Xcianify.Core.DTOs.ItemMedia
{
    public class CreateItemMediaDto
    {
        [Required]
        public int ItemId { get; set; }
        public string MediaType { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public int? FileSizeBytes { get; set; }
        public string MimeType { get; set; }
        public string MediaUrl { get; set; }
        public string Description { get; set; }
        public IFormFile File { get; set; }
    }
}
