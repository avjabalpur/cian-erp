using System;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class HsnMasterDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string HsnType { get; set; }
        public string Uqc { get; set; }
        public decimal IgstRate { get; set; }
        public decimal CgstRate { get; set; }
        public decimal SgstRate { get; set; }
        public decimal CessRate { get; set; }
        public bool IsReverseCharges { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }

    public class CreateHsnMasterDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string HsnType { get; set; }
        public string Uqc { get; set; }
        public decimal? IgstRate { get; set; } = 0;
        public decimal? CgstRate { get; set; } = 0;
        public decimal? SgstRate { get; set; } = 0;
        public decimal? CessRate { get; set; } = 0;
        public bool? IsReverseCharges { get; set; } = false;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateHsnMasterDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string HsnType { get; set; }
        public string Uqc { get; set; }
        public decimal? IgstRate { get; set; }
        public decimal? CgstRate { get; set; }
        public decimal? SgstRate { get; set; }
        public decimal? CessRate { get; set; }
        public bool? IsReverseCharges { get; set; }
        public bool? IsActive { get; set; }
    }

    public class HsnMasterFilterDto : BaseFilterDto
    {
        public bool? IsActive { get; set; }
        public string? HsnType { get; set; }
    }
}
