using System;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class SalesOrderPerformaInvoiceDto
    {
        public int Id { get; set; }
        public string ExporterName { get; set; }
        public string OrganizationName { get; set; }
        public string ConsigneeName { get; set; }
        public string ConsigneeContactDetails { get; set; }
        public string ConsigneeAddress { get; set; }
        public string PerformaInvoiceNumber { get; set; }
        public DateTime? PerformaInvoiceDate { get; set; }
        public string ExportersReferenceNumber { get; set; }
        public string OtherReferences { get; set; }
        public string OtherBuyerName { get; set; }
        public string CountryOfOrigin { get; set; }
        public string CountryOfFinalDestination { get; set; }
        public string Prepration { get; set; }
        public string PortOfDischarge { get; set; }
        public string PlaceOfReceiptByPreCarrier { get; set; }
        public string FinalDestination { get; set; }
        public string TermsOfDelivery { get; set; }
        public string PaymentTerms { get; set; }
        public string ShipmentMode { get; set; }
        public string PortOfLoading { get; set; }
        public string AdditionalCharges { get; set; }
        public double? TotalAmount { get; set; }
        public int? PreviousPerformaInvoiceId { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public int? UpdatedBy { get; set; }
        public string UpdatedByName { get; set; }
    }
} 