namespace Xcianify.Core.DTOs.ProductType
{
    public class ProductTypeDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentTypeId { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }

        // Navigation properties
        public ProductTypeDto? ParentType { get; set; }
        public ICollection<ProductTypeDto> ChildTypes { get; set; } = new List<ProductTypeDto>();
    }
} 