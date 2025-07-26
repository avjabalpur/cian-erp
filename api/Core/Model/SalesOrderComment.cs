using System;

namespace Xcianify.Core.Model
{
    public class SalesOrderComment : BaseModel
    {
        public int Id { get; set; }
        public int SalesOrderId { get; set; }
        public string Comments { get; set; }
        public string Status { get; set; }
        public string Type { get; set; }
        public bool IsDeleted { get; set; }
    }
} 