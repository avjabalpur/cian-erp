using System;

namespace Xcianify.Core.Model
{
    public class SalesOrderSaveTransaction : BaseModel
    {
        public int Id { get; set; }
        public int SalesOrderId { get; set; }
        public string Diff { get; set; }
    }
} 