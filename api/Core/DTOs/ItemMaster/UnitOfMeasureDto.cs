using System;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class UnitOfMeasureDto
    {
        public int Id { get; set; }
        public string UomCode { get; set; }
        public string UomName { get; set; }
        public decimal ConversionFactor { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }

    public class CreateUnitOfMeasureDto
    {
        public string UomCode { get; set; }
        public string UomName { get; set; }
        public decimal? ConversionFactor { get; set; }
    }

    public class UpdateUnitOfMeasureDto
    {
        public string UomCode { get; set; }
        public string UomName { get; set; }
        public decimal? ConversionFactor { get; set; }
    }

    public class UnitOfMeasureFilterDto : BaseFilterDto
    {
        public string search { get; set; }
    }
}
