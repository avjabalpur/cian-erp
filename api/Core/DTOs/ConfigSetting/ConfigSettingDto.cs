using System;

namespace Xcianify.Core.DTOs.ConfigSetting
{
    public class ConfigSettingDto
    {
        public int Id { get; set; }
        public string SettingKey { get; set; } = string.Empty;
        public string SettingName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? StringValue { get; set; }
        public long? IntegerValue { get; set; }
        public bool? BooleanValue { get; set; }
        public decimal? DecimalValue { get; set; }
        public string? DefaultValue { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }

    public class CreateConfigSettingDto
    {
        public string SettingKey { get; set; } = string.Empty;
        public string SettingName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? StringValue { get; set; }
        public long? IntegerValue { get; set; }
        public bool? BooleanValue { get; set; }
        public decimal? DecimalValue { get; set; }
        public string? DefaultValue { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateConfigSettingDto
    {
        public int Id { get; set; }
        public string SettingKey { get; set; } = string.Empty;
        public string SettingName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? StringValue { get; set; }
        public long? IntegerValue { get; set; }
        public bool? BooleanValue { get; set; }
        public decimal? DecimalValue { get; set; }
        public string? DefaultValue { get; set; }
        public bool IsActive { get; set; }
    }

    public class ConfigSettingFilterDto : BaseFilterDto
    {
        public string? search { get; set; }
        public bool? IsActive { get; set; }
    }

    public class PaginatedConfigSettingResultDto : PaginatedResult<ConfigSettingDto>
    {
    }
} 