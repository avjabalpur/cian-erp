using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs
{

    public class UpdatePermissionDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        [StringLength(50)]
        public string ModuleName { get; set; }

        [Required]
        [StringLength(20)]
        public string ActionType { get; set; }

        public bool IsActive { get; set; }
    }
}
