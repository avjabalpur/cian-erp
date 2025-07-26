using System;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class SalesOrderQuotationItemDto
    {
        public int Id { get; set; }
        public int QuotationId { get; set; }
        public int? SalesOrderId { get; set; }
        public int? ItemId { get; set; }
        public string ItemName { get; set; }
        public string Composition { get; set; }
        public string DosageName { get; set; }
        public string ProductCast { get; set; }
        public string PPackShort { get; set; }
        public string SoStatus { get; set; }
        public double? PQuantity { get; set; }
        public double? PFocQty { get; set; }
        public double? PMrp { get; set; }
        public double? PBillingRate { get; set; }
        public string Comments { get; set; }
        public double? TaxPercent { get; set; }
        public double? ProductExtraCharges { get; set; }
        public double? ProductExtraChargesTaxPercent { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public int? UpdatedBy { get; set; }
        public string UpdatedByName { get; set; }
    }
} 