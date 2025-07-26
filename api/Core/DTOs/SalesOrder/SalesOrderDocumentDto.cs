using System;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class SalesOrderDocumentDto
    {
        public int Id { get; set; }
        public int SalesOrderId { get; set; }
        public string Tag { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; }
        public string Metadata { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public int? UpdatedBy { get; set; }
        public string UpdatedByName { get; set; }
    }
} 