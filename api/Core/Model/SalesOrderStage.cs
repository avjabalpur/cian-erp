using System;

namespace Xcianify.Core.Model
{
    public class SalesOrderStage : BaseModel
    {
        public int Id { get; set; }
        public int SalesOrderId { get; set; }
        public string StageName { get; set; }
        public bool IsApproved { get; set; }
        public bool IsDeleted { get; set; }
    }
} 