using System;

namespace Xcianify.Core.DTOs.User
{
    public class UserRoleDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public DateTime AssignedAt { get; set; }
        public int? AssignedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
