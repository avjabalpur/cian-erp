using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ItemBoughtOut
{
    public class ItemBoughtOutDetailsDto
    {
        public int Id { get; set; }

        public int ItemId { get; set; }

        [StringLength(20)]
        public string PurchaseBasedOn { get; set; }

        [Range(0, 9999.99)]
        public decimal? ExcessPlanningPercent { get; set; }

        [Range(0, 99999999.9999)]
        public decimal? ReorderLevel { get; set; }

        [Range(0, 99999999.9999)]
        public decimal? MinStockLevel { get; set; }

        [Range(0, 99999999.9999)]
        public decimal? MaxStockLevel { get; set; }

        public int? MinBalanceShelfLifeDays { get; set; }

        [Range(0, 9999.99)]
        public decimal? CustomDutyPercent { get; set; }

        [Range(0, 9999.99)]
        public decimal? IgstPercent { get; set; }

        [Range(0, 9999.99)]
        public decimal? SwsPercent { get; set; }

        [Range(0, 9999999.99999)]
        public decimal? MaxPurchaseRate { get; set; }

        public bool StopProcurement { get; set; }
    }
}