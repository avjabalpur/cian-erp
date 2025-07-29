using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xcianify.Core.Model
{
    [Table("config_lists")]
    public class ConfigList
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("list_code")]
        [StringLength(50)]
        public string ListCode { get; set; } = string.Empty;

        [Required]
        [Column("list_name")]
        [StringLength(100)]
        public string ListName { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        // Navigation property
        public virtual ICollection<ConfigListValue> ConfigListValues { get; set; } = new List<ConfigListValue>();
    }
} 