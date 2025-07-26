using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class CreateSalesOrderQuotationDto
    {
        public int? OrganizationId { get; set; }
        
        [Required]
        public string QuotationNumber { get; set; }
        
        public DateTime? QuotationDate { get; set; }
        
        [Required]
        public int? CustomerId { get; set; }
        
        public double? AdvancePercentage { get; set; }
        public string Charges { get; set; }
        public double? TotalAmount { get; set; }
        public double? AdvanceAmount { get; set; }
        public int? PrevCopyQuotationId { get; set; }
    }
} 