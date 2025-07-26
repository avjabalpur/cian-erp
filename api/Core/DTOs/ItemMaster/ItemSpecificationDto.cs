using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class ItemSpecificationDto
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string ItemId { get; set; }
        
        [StringLength(1000)]
        public string Specification1 { get; set; }
        
        [StringLength(1000)]
        public string Specification2 { get; set; }
        
        [StringLength(1000)]
        public string Specification3 { get; set; }
        
        [StringLength(1000)]
        public string Specification4 { get; set; }
        
        [StringLength(1000)]
        public string Specification5 { get; set; }
        
        [StringLength(1000)]
        public string Specification6 { get; set; }
        
        [StringLength(1000)]
        public string Specification7 { get; set; }
        
        [StringLength(1000)]
        public string Specification8 { get; set; }
        
        [StringLength(1000)]
        public string Specification9 { get; set; }
        
        [StringLength(1000)]
        public string Specification10 { get; set; }
        
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
        
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
