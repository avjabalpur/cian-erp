using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xcianify.Core.Model
{
    public class ItemBoughtOutDetails : BaseModel
    {
        public int Id { get; set; }
        public string ItemCode { get; set; }
        public string PurchaseBasedOn { get; set; }
        public decimal? ExcessPlanningPercent { get; set; }
        public decimal? ReorderLevel { get; set; }
        public decimal? MinStockLevel { get; set; }
        public decimal? MaxStockLevel { get; set; }
        public int? MinBalanceShelfLifeDays { get; set; }
        public decimal? CustomDutyPercent { get; set; }
        public decimal? IgstPercent { get; set; }
        public decimal? SwsPercent { get; set; }
        public decimal? MaxPurchaseRate { get; set; }
        public bool StopProcurement { get; set; } = false;
    }
}