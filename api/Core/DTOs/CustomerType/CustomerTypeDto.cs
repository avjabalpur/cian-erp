using System;

namespace Xcianify.Core.DTOs.CustomerType
{
    public class CustomerTypeDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsExportType { get; set; }
        public bool IsDomesticType { get; set; }
        public bool RequiresDrugLicense { get; set; }
        public bool CreditTermsApplicable { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
    }
} 