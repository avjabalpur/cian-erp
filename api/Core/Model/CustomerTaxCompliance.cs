using System;

namespace Xcianify.Core.Model
{
    public class CustomerTaxCompliance : BaseModel
    {
        public int CustomerId { get; set; }
        public string? VatFormCode { get; set; }
        public string? CentralFormCode { get; set; }
        public bool IsEligibleForTcs { get; set; }
        public string? TcsType { get; set; }
        public bool IsApplicableHigherRate { get; set; }
        public bool IsDeemedNonResident { get; set; }
        public bool IsDeemedPermanentEstablishment { get; set; }
        public bool IsBillDiscount { get; set; }
        public bool IsReverseEndOfYear { get; set; }
        public decimal? CustomerInterfaceCode { get; set; }
        public string? InterfaceFileFormat { get; set; }
        public decimal? ProjectionRatio { get; set; }
        public int? NumberOfDisplays { get; set; }
        public string? LabelLayout { get; set; }
        public int? NumberOfCopies { get; set; }
        public string? SpecialTerms { get; set; }
        public string? DocumentsThrough { get; set; }
    }
} 