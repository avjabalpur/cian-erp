namespace Xcianify.Core.DTOs.CustomerAddress
{
    public class UpdateCustomerAddressDto
    {
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? AddressLine3 { get; set; }
        public string? City { get; set; }
        public string? ZipCode { get; set; }
        public string? Country { get; set; }
        public string? StateCode { get; set; }
        public string? GstStateCode { get; set; }
        public string? ContactPerson { get; set; }
        public string? TelephoneNumber { get; set; }
        public string? MobileNumber { get; set; }
        public string? FaxNumber { get; set; }
        public string? EmailId { get; set; }
        public string? Website { get; set; }
        public bool IsPrimary { get; set; }
    }
} 