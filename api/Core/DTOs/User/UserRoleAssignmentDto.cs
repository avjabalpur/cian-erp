using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.User
{
    public class UserRoleAssignmentDto
    {

        [Required]
        public int RoleId { get; set; }
        public int? AssignedBy { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
