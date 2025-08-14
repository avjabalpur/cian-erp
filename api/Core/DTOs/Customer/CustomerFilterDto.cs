namespace Xcianify.Core.DTOs.Customer
{
    public class CustomerFilterDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? Search { get; set; }
        public string? CustomerCode { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerTypeCode { get; set; }
        public string? Gstin { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsExportCustomer { get; set; }
        public string? SortBy { get; set; } = "customerName";
        public bool SortDescending { get; set; } = false;
    }
}
