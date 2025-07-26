using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class CreateSalesOrderQuotationItemDto
    {
        [Required]
        public int QuotationId { get; set; }
        
        public int? SalesOrderId { get; set; }
        public int? ItemId { get; set; }
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
    }
} 