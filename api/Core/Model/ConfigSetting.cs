using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.Model
{
    public class ConfigSetting : BaseModel
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string SettingKey { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(150)]
        public string SettingName { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        public string? StringValue { get; set; }
        
        public long? IntegerValue { get; set; }
        
        public bool? BooleanValue { get; set; }
        
        public decimal? DecimalValue { get; set; }
        
        public string? DefaultValue { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public int? CreatedBy { get; set; }
        
        public int? UpdatedBy { get; set; }
    }
} 