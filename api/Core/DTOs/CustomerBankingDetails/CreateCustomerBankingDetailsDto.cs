namespace Xcianify.Core.DTOs.CustomerBankingDetails
{
    public class CreateCustomerBankingDetailsDto
    {
        public int CustomerId { get; set; }
        public string? BankIfscCode { get; set; }
        public string? BankAccountNumber { get; set; }
        public string? BankName { get; set; }
        public string? CustomerBanker { get; set; }
        public string? CustomerVpa { get; set; }
        public string? BankAccountTypeCode { get; set; }
        public string? BankBranch { get; set; }
        public string? BankLocation { get; set; }
        public bool IsPrimary { get; set; } = true;
    }
} 