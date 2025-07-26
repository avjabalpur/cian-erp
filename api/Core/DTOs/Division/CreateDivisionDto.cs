using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.Division
{
    public class CreateDivisionDto
    {
        [Required]
        [StringLength(10)]
        public string Code { get; set; }

        public int? DepartmentId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }
        
        [StringLength(10)]
        public string Unit { get; set; }
        
        public decimal ConversionFactor { get; set; } = 1.0m;
        
        public bool IsActive { get; set; } = true;
    }
}
