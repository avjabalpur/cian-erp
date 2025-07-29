using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xcianify.Core.Model
{
    [Table("hsn_master")]
    public class HsnMaster : BaseModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        public string Code { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        [StringLength(1)]
        public string HsnType { get; set; }

        [StringLength(50)]
        public string Uqc { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal IgstRate { get; set; } = 0;

        [Column(TypeName = "decimal(5,2)")]
        public decimal CgstRate { get; set; } = 0;

        [Column(TypeName = "decimal(5,2)")]
        public decimal SgstRate { get; set; } = 0;

        [Column(TypeName = "decimal(5,2)")]
        public decimal CessRate { get; set; } = 0;

        public bool IsReverseCharges { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public int? CreatedBy { get; set; }

        public int? UpdatedBy { get; set; }
    }
}
