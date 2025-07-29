using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Xcianify.Core.Model
{
    [Table("config_list_values")]
    public class ConfigListValue
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("list_id")]
        public int ListId { get; set; }

        [Required]
        [Column("value_code")]
        [StringLength(50)]
        public string ValueCode { get; set; } = string.Empty;

        [Required]
        [Column("value_name")]
        [StringLength(100)]
        public string ValueName { get; set; } = string.Empty;

        [Column("display_order")]
        public int DisplayOrder { get; set; } = 0;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("extra_data")]
        public JsonDocument? ExtraData { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        // Navigation property
        [ForeignKey("ListId")]
        public virtual ConfigList ConfigList { get; set; } = null!;
    }
} 