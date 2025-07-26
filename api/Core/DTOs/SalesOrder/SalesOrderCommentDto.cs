using System;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class SalesOrderCommentDto
    {
        public int Id { get; set; }
        public int SalesOrderId { get; set; }
        public string Comments { get; set; }
        public string Status { get; set; }
        public string Type { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public int? UpdatedBy { get; set; }
        public string UpdatedByName { get; set; }
    }
} 