using System;

namespace Xcianify.Core.Model
{
    public class ProductGroup : BaseModel
    {
        public string Code { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string ProductGroupName { get; set; } = string.Empty;
        public string Unit { get; set; } = "NOS";
        public int? SalesDivisionCode { get; set; }
        public string UomForMls { get; set; } = "NOS";
        public decimal ConversionFactor { get; set; } = 1.00000000m;
        public string ConversionFactorUnit { get; set; } = "NOS/NOS";
        public string? CostCentreCode { get; set; }
        public bool IsClosed { get; set; } = false;
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedTimestamp { get; set; }
        public string RevNo { get; set; } = "00938";
        public bool IsActive { get; set; } = false;
    }
} 