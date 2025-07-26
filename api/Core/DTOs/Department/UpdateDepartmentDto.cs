using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.Department
{
    public class UpdateDepartmentDto
    {
        [Required]
        [StringLength(10)]
        public string Code { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }
        
        [StringLength(10)]
        public string UomForMis { get; set; }
        
        public bool IsActive { get; set; }
    }
}
