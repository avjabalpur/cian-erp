using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ProductGroup
{
    public class CreateProductGroupDto
    {
        [Required]
        [StringLength(10)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Level { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string ProductGroupName { get; set; } = string.Empty;

        [StringLength(10)]
        public string Unit { get; set; } = "NOS";

        public int? SalesDivisionCode { get; set; }

        [StringLength(10)]
        public string UomForMls { get; set; } = "NOS";

        public decimal ConversionFactor { get; set; } = 1.00000000m;

        [StringLength(20)]
        public string ConversionFactorUnit { get; set; } = "NOS/NOS";

        [StringLength(10)]
        public string? CostCentreCode { get; set; }

        public bool IsClosed { get; set; } = false;

        [StringLength(10)]
        public string RevNo { get; set; } = "00938";

        public bool IsActive { get; set; } = false;
    }
} 