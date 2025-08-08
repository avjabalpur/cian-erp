using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class ItemSpecificationDto
    {
        public int Id { get; set; }
        
        public int ItemId { get; set; }
        
        [StringLength(50)]
        public string Specification { get; set; }
      
        [StringLength(50)]
        public string SubstituteForItemCode { get; set; }
        
        [StringLength(50)]
        public string CustomTariffNo { get; set; }
        
        [StringLength(50)]
        public string ExciseTariffNo { get; set; }
        
        [StringLength(50)]
        public string VatCommCode { get; set; }
        
        public decimal? ConversionFactor { get; set; }
        
        [StringLength(50)]
        public string OldCode { get; set; }
        
        public decimal? StandardWeight { get; set; }
        public decimal? StandardConversionCostFactor { get; set; }
        public decimal? StandardPackingCostFactor { get; set; }
        public decimal? MarkupPercentage { get; set; }
        public decimal? MarkupAmount { get; set; }
        
    }
}
