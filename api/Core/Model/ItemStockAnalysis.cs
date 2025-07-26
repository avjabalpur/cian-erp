using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xcianify.Core.Model
{
    public class ItemStockAnalysis : BaseModel
    {
        public int Id { get; set; }
        public int ItemMasterId { get; set; }
        public virtual ItemMaster ItemMaster { get; set; }
        public decimal? MinimumStockLevel { get; set; }
        public decimal? MaximumStockLevel { get; set; }
        public decimal? ReorderLevel { get; set; }
        public decimal? EconomicOrderQuantity { get; set; }
        public int? LeadTimeDays { get; set; }
        public decimal? AverageUsagePerDay { get; set; }
        public DateTime? LastStockCheckDate { get; set; }
        public decimal? LastStockQuantity { get; set; }
        public DateTime? NextStockCheckDate { get; set; }
        public bool IsActive { get; set; } = true;
        public string Notes { get; set; }
    }
}
