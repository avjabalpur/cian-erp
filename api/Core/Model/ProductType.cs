using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.Model
{
    public class ProductType : BaseModel
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

        // Navigation properties (for Dapper mapping)
        public ProductType? ParentType { get; set; }
        public List<ProductType> ChildTypes { get; set; } = new List<ProductType>();
    }
} 