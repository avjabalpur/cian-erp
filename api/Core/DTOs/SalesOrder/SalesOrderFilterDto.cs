using System;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class SalesOrderFilterDto
    {
        public string? SearchTerm { get; set; }
        public string? SoNumber { get; set; }
        public string? SoStatus { get; set; }
        public int? CustomerId { get; set; }
        public int? OrganizationId { get; set; }
        public int? DivisionId { get; set; }
        public int? ItemId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool? IsSubmitted { get; set; }
        public int? AssignedDesigner { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "created_at";
        public string? SortOrder { get; set; } = "DESC";
    }
}
