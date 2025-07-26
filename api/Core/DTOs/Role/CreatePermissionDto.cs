using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xcianify.Core.DTOs
{
    public class CreatePermissionDto
    {
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

        public bool IsActive { get; set; } = true;
    }
}
