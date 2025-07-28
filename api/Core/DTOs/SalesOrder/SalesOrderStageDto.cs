using System;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class SalesOrderStageDto
    {
        public int Id { get; set; }
        public int SalesOrderId { get; set; }
        public string StageName { get; set; }
        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public int? UpdatedBy { get; set; }
        public string UpdatedByName { get; set; }
    }
} 