using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ProductType
{
    public class UpdateProductTypeDto
    {
        [Required]
        [StringLength(10)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int? ParentTypeId { get; set; }

        public bool IsActive { get; set; } = true;
    }
} 