using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class CreateSalesOrderPerformaInvoiceItemDto
    {
        [Required]
        public int PerformaInvoiceId { get; set; }
        
        public int? SalesOrderId { get; set; }
        
        public int? ItemId { get; set; }
        
        public string Composition { get; set; }
        
        public string DosageName { get; set; }
        
        public string ProductCast { get; set; }
        
        public string PPackShort { get; set; }
        
        public decimal? PQuantity { get; set; }
        
        public decimal? PFocQty { get; set; }
        
        public decimal? PBillingRate { get; set; }
    }
} 