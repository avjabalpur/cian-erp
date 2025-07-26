using System;

namespace Xcianify.Core.Model
{
    public class OrganizationAccount : BaseModel
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public string AccountType { get; set; } // BANK, PAYPAL, etc.
        public string AccountNumber { get; set; }
        public string BankName { get; set; }
        public string IfscCode { get; set; }
        public string SwiftCode { get; set; }
        public string AccountHolderName { get; set; }
        
    }
}
