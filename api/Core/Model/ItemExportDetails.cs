using System;

namespace Xcianify.Core.Model
{
    public class ItemExportDetails : BaseModel
    {
        public int Id { get; set; }
        public string ItemCode { get; set; }
        public string ExportDescription { get; set; }
        public string ExportProductGroupCode { get; set; }
        public string ExportProductGroupName { get; set; }
        public string DepbRateListSrlNo { get; set; }
        public decimal? DepbRate { get; set; }
        public decimal? DepbValueCap { get; set; }
        public string DepbRemarks { get; set; }
        public string DrawbackSrlNo { get; set; }
        public decimal? DrawbackRate { get; set; }
        public string DrawbackRateType { get; set; }
        public decimal? DrawbackValueCap { get; set; }
        public string DrawbackRemarks { get; set; }
    }
}
