using System;

namespace Xcianify.Core.Model
{
    public class SalesOrderQuotation : BaseModel
    {
        public int Id { get; set; }
        public int? OrganizationId { get; set; }
        public string QuotationNumber { get; set; }
        public DateTime? QuotationDate { get; set; }
        public int? CustomerId { get; set; }
        public double? AdvancePercentage { get; set; }
        public string Charges { get; set; }
        public double? TotalAmount { get; set; }
        public double? AdvanceAmount { get; set; }
        public int? PrevCopyQuotationId { get; set; }
        public bool IsDeleted { get; set; }

        // Computed properties for backward compatibility
        public string CompanyName { get; set; }
        public string CustomerName { get; set; }
        public string CustomerContactPerson { get; set; }
        public string CustomerMobileNumber { get; set; }
        public string CustomerEmail { get; set; }
        public string PaymentTerms { get; set; }
        public string FinalComment { get; set; }
        public string Terms { get; set; }
    }
} 