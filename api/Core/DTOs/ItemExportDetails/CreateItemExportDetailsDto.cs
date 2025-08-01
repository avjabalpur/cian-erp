using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ItemExportDetails
{
    public class CreateItemExportDetailsDto
    {
        public int ItemId { get; set; }
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
