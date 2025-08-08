using System;

namespace Xcianify.Core.DTOs.Customer
{
    public class CreateCustomerDto
    {
        public string LocationCode { get; set; } = string.Empty;
        public string CustomerNumber { get; set; } = string.Empty;
        public string CustomerCode { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string? ShortName { get; set; }
        public string? PayeeName { get; set; }
        public string? CustomerTypeCode { get; set; }
        public string? SegmentCode { get; set; }
        public string? IncomeTaxPanNumber { get; set; }
        public string? CustomerSaleType { get; set; }
        public string? ExportType { get; set; }
        public string? Gstin { get; set; }
        public string? DrugLicenseNumber { get; set; }
        public DateTime? DrugLicenseExpiryDate { get; set; }
        public string? OtherLicenseNumber { get; set; }
        public string? OldCode { get; set; }
        public string? CustomerLotNumber { get; set; }
        public bool StopInvoice { get; set; }
        public bool IsExportCustomer { get; set; }
        public bool IsRegisteredDealer { get; set; }
        public bool IsRecordClosed { get; set; }
        public bool IsActive { get; set; } = true;
        public string? Continent { get; set; }
        public string? Rebates { get; set; }
        public string? ExternalInformation { get; set; }
    }
}
