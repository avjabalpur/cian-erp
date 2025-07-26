using System;

namespace Xcianify.Core.DTOs.Organization
{
    public class OrganizationAccountDto
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public string AccountType { get; set; }
        public string AccountNumber { get; set; }
        public string BankName { get; set; }
        public string IfscCode { get; set; }
        public string SwiftCode { get; set; }
        public string AccountHolderName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateOrganizationAccountDto
    {
        public int OrganizationId { get; set; }
        public string AccountType { get; set; }
        public string AccountNumber { get; set; }
        public string BankName { get; set; }
        public string IfscCode { get; set; }
        public string SwiftCode { get; set; }
        public string AccountHolderName { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateOrganizationAccountDto : CreateOrganizationAccountDto
    {
        public int Id { get; set; }
    }
}
