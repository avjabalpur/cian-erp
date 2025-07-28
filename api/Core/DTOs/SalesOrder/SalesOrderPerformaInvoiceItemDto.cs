using System;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class SalesOrderPerformaInvoiceItemDto
    {
        public int Id { get; set; }
        public int PerformaInvoiceId { get; set; }
        public int? SalesOrderId { get; set; }
        public int? ItemId { get; set; }
        public string ItemName { get; set; }
        public string Composition { get; set; }
        public string DosageName { get; set; }
        public string ProductCast { get; set; }
        public string PPackShort { get; set; }
        public decimal? PQuantity { get; set; }
        public decimal? PFocQty { get; set; }
        public decimal? PBillingRate { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public int? UpdatedBy { get; set; }
        public string UpdatedByName { get; set; }
    }
} 