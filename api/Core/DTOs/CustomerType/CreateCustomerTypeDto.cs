namespace Xcianify.Core.DTOs.CustomerType
{
    public class CreateCustomerTypeDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsExportType { get; set; }
        public bool IsDomesticType { get; set; }
        public bool RequiresDrugLicense { get; set; }
        public bool CreditTermsApplicable { get; set; }
        public bool IsActive { get; set; } = true;
    }
} 