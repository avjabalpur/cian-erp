using System;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class ItemSalesDetailDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public decimal? SellingPrice { get; set; }
        public int? CurrencyId { get; set; }
        public bool IsTaxInclusive { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public decimal? MinimumOrderQuantity { get; set; }
        public int? LeadTimeDays { get; set; }
        public bool IsActive { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }

    public class CreateItemSalesDetailDto
    {
        public int ItemId { get; set; }
        public decimal? SellingPrice { get; set; }
        public int? CurrencyId { get; set; }
        public bool IsTaxInclusive { get; set; } = false;
        public decimal? DiscountPercentage { get; set; }
        public decimal? MinimumOrderQuantity { get; set; }
        public int? LeadTimeDays { get; set; }
        public bool IsActive { get; set; } = true;
        public string Notes { get; set; }
    }

    public class UpdateItemSalesDetailDto
    {
        public decimal? SellingPrice { get; set; }
        public int? CurrencyId { get; set; }
        public bool? IsTaxInclusive { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public decimal? MinimumOrderQuantity { get; set; }
        public int? LeadTimeDays { get; set; }
        public bool? IsActive { get; set; }
        public string Notes { get; set; }
    }
}
