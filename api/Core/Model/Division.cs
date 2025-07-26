using System;

namespace Xcianify.Core.Model
{
    public class Division
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int? DepartmentId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Unit { get; set; }
        public decimal ConversionFactor { get; set; } = 1.0m;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        
        // Navigation property
        public Department Department { get; set; }
    }
}
