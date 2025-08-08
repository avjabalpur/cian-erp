using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ItemExportDetails
{
    public class CreateItemExportDetailsDto
    {
        public int ItemId { get; set; }
        public string ItemDescriptionForExports { get; set; }
        public string ExportProductGroupCode { get; set; }
        public string ExportProductGroupName { get; set; }
        public string DepbRateListSrlNo { get; set; }
        public decimal? DepbRate { get; set; }
        public decimal? DepbValueCap { get; set; }
        public string DepbRemarks { get; set; }
        public string DutyDrawbackSrlNo { get; set; }
        
        public decimal? DutyDrawbackRate { get; set; }
        public string DutyDrawbackRateType { get; set; }
        public decimal? DutyDrawbackValueCap { get; set; }
        public string DutyDrawbackRemarks { get; set; }
    }
}
