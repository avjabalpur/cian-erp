using System;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class SalesOrderQuotationDto
    {
        public int Id { get; set; }
        public int? OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public string QuotationNumber { get; set; }
        public DateTime? QuotationDate { get; set; }
        public int? CustomerId { get; set; }
        public string CustomerName { get; set; }
        public double? AdvancePercentage { get; set; }
        public string Charges { get; set; }
        public double? TotalAmount { get; set; }
        public double? AdvanceAmount { get; set; }
        public int? PrevCopyQuotationId { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public int? UpdatedBy { get; set; }
        public string UpdatedByName { get; set; }
    }
} 