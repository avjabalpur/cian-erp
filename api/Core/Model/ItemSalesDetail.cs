using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xcianify.Core.Model
{
    public class ItemSalesDetail : BaseModel
    {
        public int Id { get; set; }
        public int ItemMasterId { get; set; }
        public virtual ItemMaster ItemMaster { get; set; }
        public decimal? SellingPrice { get; set; }
        public int? CurrencyId { get; set; }
        public bool IsTaxInclusive { get; set; } = false;
        public decimal? DiscountPercentage { get; set; }
        public decimal? MinimumOrderQuantity { get; set; }
        public int? LeadTimeDays { get; set; }
        public bool IsActive { get; set; } = true;
        public string Notes { get; set; }
    }
}
