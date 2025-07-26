using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs
{
    public class PermissionDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ModuleName { get; set; }
        public string ActionType { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
