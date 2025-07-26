using System;

namespace Xcianify.Core.Model
{
    public class SalesOrderChat : BaseModel
    {
        public int Id { get; set; }
        public int SalesOrderId { get; set; }
        public string Comment { get; set; }
    }
} 