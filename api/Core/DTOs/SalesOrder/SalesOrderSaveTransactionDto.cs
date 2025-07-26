using System;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class SalesOrderSaveTransactionDto
    {
        public int Id { get; set; }
        public int SalesOrderId { get; set; }
        public string Diff { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedByName { get; set; }
    }
} 