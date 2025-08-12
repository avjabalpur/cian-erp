using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.Model
{
    public class ItemSalesDetails : BaseModel
    {
        public int Id { get; set; }
        public string ItemCode { get; set; }
        public bool? PackSizeApplicable { get; set; }
        public string DefaultPackSize { get; set; }
        public int? SaleableUnitContains { get; set; }
        public int? QtyPerBox { get; set; }
        public int? BoxesPerCase { get; set; }
        public string CasePackingType { get; set; }
        public decimal? PackingRate { get; set; }
        public decimal? QtyPerCase { get; set; }
        public decimal? NetWeightCase { get; set; }
        public decimal? TareWeightCase { get; set; }
        public decimal? GrossWeightCase { get; set; }
        public decimal? GrossWeightUnit { get; set; }
        public string CaseDimensionsInches { get; set; }
        public decimal? CaseVolumeCft { get; set; }
        public string CaseDimensionsCm { get; set; }
        public decimal? CaseVolumeCbm { get; set; }
        public decimal? MinSaleRate { get; set; }
        public decimal? MinSoQty { get; set; }
        public string TertiaryGtin { get; set; }
        public string SecondaryGtin { get; set; }
        public string PrimaryGtin { get; set; }
        public decimal? MinBatchQtyAutoloading { get; set; }
        public DateTime? ConsiderAsNewProductTill { get; set; }
        public string InterfaceCode { get; set; }
        public string Specs { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
} 