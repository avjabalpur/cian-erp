namespace Xcianify.Core.DTOs.CustomerBusinessTerms
{
    public class UpdateCustomerBusinessTermsDto
    {
        public string? DestinationCode { get; set; }
        public string? TransportModeCode { get; set; }
        public string? TransporterCode { get; set; }
        public int? LeadDays { get; set; }
        public decimal? CustomerDistance { get; set; }
        public string? FreightIndicator { get; set; }
        public string? SupplyStockLocation { get; set; }
        public bool AllowConsignmentOnBooking { get; set; }
        public string? CustomerAccountCode { get; set; }
        public decimal? CreditLimit { get; set; }
        public decimal? MinimumInvoiceAmount { get; set; }
        public string? CustomerSchemeCode { get; set; }
        public string? CustomerBrokerCode { get; set; }
        public decimal? CustomerBrokerRate { get; set; }
        public decimal? CashDiscountPercentage { get; set; }
        public decimal? MiscChargePercentage { get; set; }
        public decimal? MiscDiscountPercentage { get; set; }
        public string? PaymentTermCode { get; set; }
        public int? CreditPeriodDays { get; set; }
        public int? NewPartyCreditPeriodDays { get; set; }
        public bool IsOverdueCheck { get; set; }
        public int? NumberOfBills { get; set; }
        public int? OutstandingBillPeriodDays { get; set; }
        public string? OutstandingBillAccountIndicator { get; set; }
    }
} 