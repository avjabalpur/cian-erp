using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class CreateItemSpecificationDto
    {
        public int ItemId { get; set; }
        public string? SubstituteForItemCode { get; set; }
        public string? CustomTariffNo { get; set; }
        public string? ExciseTariffNo { get; set; }
        public string? VatCommCode { get; set; }
        public decimal? ConversionFactor { get; set; }
        public string? OldCode { get; set; }
        public decimal? StandardWeight { get; set; }
        public decimal? StandardConversionCostFactor { get; set; }
        public decimal? StandardPackingCostFactor { get; set; }
        public decimal? MarkupPercentage { get; set; }
        public decimal? MarkupAmount { get; set; }
        
        public string? Specification { get; set; }

    }
}
