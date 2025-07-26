using System;

namespace Xcianify.Core.Model
{
    public class UserRole : BaseModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public DateTime AssignedAt { get; set; }
        public int? AssignedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
