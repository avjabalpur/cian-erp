using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace Xcianify.Core.DTOs
{
    public class AssignPermissionToRoleDto
    {
        [Required]
        public int RoleId { get; set; }

        public int PermissionId { get; set; }

        public int? GrantedBy { get; set; }
    }
}
