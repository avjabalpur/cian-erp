using System.Collections.Generic;

namespace Xcianify.Core.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalCustomers { get; set; }
        public int TotalItems { get; set; }
        public int TotalSalesOrders { get; set; }
        public List<RecentCustomerDto> RecentCustomers { get; set; } = new List<RecentCustomerDto>();
        public List<RecentItemDto> RecentItems { get; set; } = new List<RecentItemDto>();
        public List<RecentSalesOrderDto> RecentSalesOrders { get; set; } = new List<RecentSalesOrderDto>();
    }

    public class RecentCustomerDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }

    public class RecentItemDto
    {
        public int Id { get; set; }
        public string ItemCode { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public string ItemType { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string CreatedAt { get; set; } = string.Empty;
    }

    public class RecentSalesOrderDto
    {
        public int Id { get; set; }
        public string SoNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string SoStatus { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string CreatedAt { get; set; } = string.Empty;
    }
} 