using System;

namespace Xcianify.Core.Model
{
    public class SalesOrderDocument : BaseModel
    {
        public int Id { get; set; }
        public int SalesOrderId { get; set; }
        public string Tag { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; }
        public string Metadata { get; set; }
        public bool IsDeleted { get; set; }
    }
} 