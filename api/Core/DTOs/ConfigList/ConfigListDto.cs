using System;

namespace Xcianify.Core.DTOs.ConfigList
{
    public class ConfigListDto
    {
        public int Id { get; set; }
        public string ListCode { get; set; }
        public string ListName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }

    public class CreateConfigListDto
    {
        public string ListCode { get; set; }
        public string ListName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateConfigListDto
    {
        public string ListCode { get; set; }
        public string ListName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class ConfigListFilterDto : BaseFilterDto
    {
        public bool? IsActive { get; set; }
        public string? ListCode { get; set; }
    }
} 