using System;
using System.Text.Json;

namespace Xcianify.Core.DTOs.ConfigList
{
    public class ConfigListValueDto
    {
        public int Id { get; set; }
        public int ListId { get; set; }
        public string ValueCode { get; set; }
        public string ValueName { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public JsonDocument? ExtraData { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        // Navigation properties
        public string? ListCode { get; set; }
        public string? ListName { get; set; }
    }

    public class CreateConfigListValueDto
    {
        public int ListId { get; set; }
        public string ValueCode { get; set; }
        public string ValueName { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public JsonDocument? ExtraData { get; set; }
    }

    public class UpdateConfigListValueDto
    {
        public int ListId { get; set; }
        public string ValueCode { get; set; }
        public string ValueName { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public JsonDocument? ExtraData { get; set; }
    }

    public class ConfigListValueFilterDto : BaseFilterDto
    {
        public int? ListId { get; set; }
        public bool? IsActive { get; set; }
        public string? ValueCode { get; set; }
    }
} 