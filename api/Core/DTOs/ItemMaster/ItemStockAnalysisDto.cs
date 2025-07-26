using System;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class ItemStockAnalysisDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public decimal? MinimumStockLevel { get; set; }
        public decimal? MaximumStockLevel { get; set; }
        public decimal? ReorderLevel { get; set; }
        public decimal? EconomicOrderQuantity { get; set; }
        public int? LeadTimeDays { get; set; }
        public decimal? AverageUsagePerDay { get; set; }
        public DateTime? LastStockCheckDate { get; set; }
        public decimal? LastStockQuantity { get; set; }
        public DateTime? NextStockCheckDate { get; set; }
        public bool IsActive { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }

    public class CreateItemStockAnalysisDto
    {
        public int ItemId { get; set; }
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

    public class UpdateItemStockAnalysisDto
    {
        public decimal? MinimumStockLevel { get; set; }
        public decimal? MaximumStockLevel { get; set; }
        public decimal? ReorderLevel { get; set; }
        public decimal? EconomicOrderQuantity { get; set; }
        public int? LeadTimeDays { get; set; }
        public decimal? AverageUsagePerDay { get; set; }
        public DateTime? LastStockCheckDate { get; set; }
        public decimal? LastStockQuantity { get; set; }
        public DateTime? NextStockCheckDate { get; set; }
        public bool? IsActive { get; set; }
        public string Notes { get; set; }
    }
}
