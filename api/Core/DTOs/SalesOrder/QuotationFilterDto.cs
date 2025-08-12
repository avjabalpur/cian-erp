using System;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class QuotationFilterDto
    {
        public string? Search { get; set; }
        public string? CompanyName { get; set; }
        public string? CustomerName { get; set; }
        public string? Status { get; set; }
        public int? CreatedBy { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public string? SortBy { get; set; } = "created_at";
        public string? SortOrder { get; set; } = "desc";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public DateTime? GetFromDate()
        {
            return !string.IsNullOrEmpty(FromDate) && DateTime.TryParse(FromDate, out var date) ? date : null;
        }

        public DateTime? GetToDate()
        {
            return !string.IsNullOrEmpty(ToDate) && DateTime.TryParse(ToDate, out var date) ? date : null;
        }
    }
}
