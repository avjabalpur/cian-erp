using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Xcianify.Core.DTOs.ItemMedia
{
    public class CreateItemMediaDto
    {
        [Required]
        public int ItemId { get; set; }
        
        [StringLength(50)]
        public string MediaType { get; set; }
        
        [StringLength(255)]
        public string FileName { get; set; }
        
        [StringLength(20)]
        public string FileExtension { get; set; }
        
        [Range(0, long.MaxValue)]
        public int? FileSizeBytes { get; set; }
        
        [StringLength(100)]
        public string MimeType { get; set; }
        
        [StringLength(1000)]
        public string Description { get; set; }
        
        [Required]
        public IFormFile File { get; set; }
    }
}
