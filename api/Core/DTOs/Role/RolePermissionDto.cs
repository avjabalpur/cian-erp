namespace Xcianify.Core.DTOs
{
    public class RolePermissionDto
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
        public DateTime GrantedAt { get; set; }
        public int? GrantedBy { get; set; }
    }
}
